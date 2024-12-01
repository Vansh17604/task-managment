import { useDrop } from 'react-dnd';
import Task from './Task';

const Board = ({ board, onAddTask, onDropTask }: any) => {
  const [, drop] = useDrop({
    accept: 'TASK',
    drop: (item) => onDropTask(board.id, item),
  });

  return (
    <div
      ref={drop}
      className="shade-card p-4 m-2 rounded-lg shadow-lg bg-gray-100"
      style={{ width: '300px' }}
    >
      <h3 className="font-bold text-lg">{board.name}</h3>
      <button
        className="shade-btn mt-2 w-full"
        onClick={() => onAddTask(board.id)}
      >
        Add Task
      </button>
      <div className="mt-4">
        {board.tasks.map((task: any) => (
          <Task key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default Board;
