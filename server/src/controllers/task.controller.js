const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createTask = async (req, res) => {
  try {
    const { title, description, columnId, priority, dueDate, assigneeId } = req.body;
    const count = await prisma.task.count({ where: { columnId } });
    const task = await prisma.task.create({
      data: {
        title, description, columnId, priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        assigneeId: assigneeId || null,
        creatorId: req.userId,
        order: count
      },
      include: {
        assignee: { select: { id: true, name: true } },
        creator: { select: { id: true, name: true } }
      }
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await prisma.task.update({
      where: { id },
      data: req.body,
      include: {
        assignee: { select: { id: true, name: true } },
        creator: { select: { id: true, name: true } }
      }
    });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.task.delete({ where: { id } });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createTask, updateTask, deleteTask };