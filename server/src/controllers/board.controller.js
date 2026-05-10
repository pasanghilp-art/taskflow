const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createBoard = async (req, res) => {
  try {
    const { name, workspaceId } = req.body;
    const board = await prisma.board.create({
      data: {
        name,
        workspaceId,
        columns: {
          create: [
            { name: 'To Do', order: 0 },
            { name: 'In Progress', order: 1 },
            { name: 'Done', order: 2 },
          ]
        }
      },
      include: { columns: true }
    });
    res.status(201).json(board);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getBoards = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const boards = await prisma.board.findMany({
      where: { workspaceId },
      include: {
        columns: {
          include: {
            tasks: {
              include: {
                assignee: { select: { id: true, name: true } },
                creator: { select: { id: true, name: true } }
              },
              orderBy: { order: 'asc' }
            }
          },
          orderBy: { order: 'asc' }
        }
      }
    });
    res.json(boards);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createBoard, getBoards };