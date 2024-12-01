import  { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import * as apiClient from "../api-client";
import { BoardForm} from "./BoardForm";

import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";

interface Board {
  _id: string;
  name: string;
}

const Home = () => {
  const [boards, setBoards] = useState<Board[]>([]);
 
  const navigate = useNavigate();

  // Fetch boards using the correct query function
  const { data, isLoading, isError,  } = useQuery<Board[]>("boards", apiClient.fetchBoards);

  useEffect(() => {
    if (data) {
      setBoards(data); // Correctly set boards
    }
  }, [data]);

  // Handle board click to view more details
  const handleClick = (boardId: string) => {
    navigate(`/edit-board/${boardId}`);
  };

  const handleOnDragEnd = (result: DropResult) => {
    const { destination, source } = result;
    if (!destination) return;

    const reorderedBoards = Array.from(boards);
    const [removed] = reorderedBoards.splice(source.index, 1);
    reorderedBoards.splice(destination.index, 0, removed);

    setBoards(reorderedBoards);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading boards: </div>;

  return (
    <div className="h-screen flex flex-col items-center bg-gray-100">
      <div className="w-full max-w-7xl mt-8 p-4">
        <Button
          className="mb-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          onClick={() => navigate("/create")}
        >
          Create New Board
        </Button>

        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="boards" direction="vertical">
            {(provided) => (
              <div
                className="grid grid-cols-3 gap-4"
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{ minHeight: "100px" }}
              >
                {boards.map((board, index) => (
                  <Draggable key={board._id} draggableId={board._id} index={index}>
                    {(provided) => (
                      <div
                        className="flex justify-center"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          ...provided.draggableProps.style,
                          cursor: "pointer",
                        }}
                      >
                        <Card className="w-60">
                          <div className="p-4">
                            <h3 className="font-semibold text-xl">{board.name}</h3>
                            <Button
                              onClick={() => handleClick(board._id)}
                              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                            >
                              View Board
                            </Button>
                          </div>
                        </Card>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
      <BoardForm />
    </div>
  );
};

export default Home;
