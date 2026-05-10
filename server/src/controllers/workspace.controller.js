const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createWorkspace = async (req, res) => {
  try {
    const { name } = req.body;
    const workspace = await prisma.workspace.create({
      data: {
        name,
        members: {
          create: { userId: req.userId, role: 'admin' }
        }
      },
      include: { members: true }
    });
    res.status(201).json(workspace);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getWorkspaces = async (req, res) => {
  try {
    const workspaces = await prisma.workspace.findMany({
      where: { members: { some: { userId: req.userId } } },
      include: { members: { include: { user: { select: { id: true, name: true, email: true } } } } }
    });
    res.json(workspaces);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createWorkspace, getWorkspaces };