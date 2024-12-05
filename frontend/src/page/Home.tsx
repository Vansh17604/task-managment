import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import * as apiClient from '../api-client';
import { useAppContext } from '../context/AppContext';
import BoardCard from './BoardCard';
import BoardForm from './BoardForm';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';


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

const Home = () => {
  const [boards, setBoards] = useState<Board[]>([]);
  const { isLoggedIn } = useAppContext();


  const { data } = useQuery<Board[]>("boards", apiClient.fetchBoards);


  useEffect(() => {
    if (data) {
      if (Array.isArray(data)) {
        setBoards(data); 
      } else {
        console.error("Data is not in the expected format:", data);
      }
    }
  }, [data]);

  

  
  const handleOnDragEnd = (result: any) => {
    const { source, destination } = result;

   
    if (!destination || source.index === destination.index) {
      return;
    }

    const reorderedBoards = Array.from(boards);
    const [removed] = reorderedBoards.splice(source.index, 1);
    reorderedBoards.splice(destination.index, 0, removed);

    setBoards(reorderedBoards);
  };

  return (
    <div className="home-container">
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="board-list" direction="horizontal">
          {(provided) => (
            <div
              className="flex space-x-4 overflow-x-auto py-4 p-7"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {boards.map((board, index) => (
                <Draggable key={board._id} draggableId={board._id} index={index}>
                  {(provided) => (
                    <div
                      className="flex-none w-60"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <BoardCard board={board} /> 
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {isLoggedIn && <BoardForm />}
    </div>
  );
};

export default Home;
