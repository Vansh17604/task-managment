import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface Task {
  _id: string;
  title: string;
  description: string;
}

interface Board {
  _id: string;
  name: string;
  task: Task[];
}

interface BoardCardProps {
  board: Board;
}

const BoardCard: FC<BoardCardProps> = ({ board }) => {
  const navigate = useNavigate();

  const handleClick = (boardId: string) => {
    navigate(`/edit-board/${boardId}`);
  };

  return (
    <div className="flex justify-center space-x-4"> 
      <Card className="w-60">
        <div className="p-4">
          <h3 className="font-semibold text-xl">{board.name}</h3>

          
          {board.task && board.task.length > 0 ? (
            <ul className="mt-4 space-y-2">
              {board.task.map((task) => (
                <li key={task._id} className="text-sm">
                  <strong>{task.title}</strong>
                  <p>{task.description}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No tasks available</p>
          )}

          <Button
            onClick={() => handleClick(board._id)}
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            View Board
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default BoardCard;
