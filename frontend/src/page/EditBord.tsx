import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from "react-query";
import { useAppContext } from "@/context/AppContext";
import * as apiClient from "../api-client"; // Ensure this imports your API functions

export const EditBoard = () => {
  const { showToast } = useAppContext();
  const { boardId } = useParams();
  const navigate = useNavigate();
  const [boardName, setBoardName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const response = await apiClient.getBoard(boardId!); // Fetch the board data
        setBoardName(response.name); // Set the fetched name in state
        setIsLoading(false); // Set loading to false after the board is fetched
      } catch (error) {
        console.error("Error fetching board:", error);
        setIsLoading(false);
      }
    };

    if (boardId) {
      fetchBoard();
    }
  }, [boardId]);

  // Update board mutation
  const updateBoardMutation = useMutation(
    (data: { boardId: string; name: string }) => apiClient.updateBoard(data.boardId, data.name),
    {
      onSuccess: () => {
        showToast({ message: "Board updated successfully!", type: "SUCCESS" });
        navigate("/"); // Navigate to the homepage after successful update
      },
      onError: (error: Error) => {
        showToast({ message: error.message, type: "ERROR" });
      },
    }
  );

  // Delete board mutation
  const deleteBoardMutation = useMutation((boardId: string) => apiClient.deleteBoard(boardId), {
    onSuccess: () => {
      showToast({ message: "Board deleted successfully!", type: "SUCCESS" });
      navigate("/"); // Navigate to the homepage after deletion
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  const handleUpdate = () => {
    if (boardId) {
      updateBoardMutation.mutate({ boardId, name: boardName });
    }
  };

  const handleDelete = () => {
    if (boardId) {
      deleteBoardMutation.mutate(boardId);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>; // Show loading state while fetching the board data
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 py-8">
      <div className="max-w-md w-full p-5 bg-white shadow-md rounded-md border border-gray-300">
        <h2 className="text-2xl font-semibold text-center mb-4">Edit Board</h2>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Board Name
            </Label>
            <Input
              id="name"
              type="text"
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)} // Update state on input change
              className="w-full mt-1"
            />
          </div>

          <div className="flex justify-between gap-4">
            <Button
              onClick={handleUpdate}
              className="w-1/2 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            >
              Save Changes
            </Button>
            <Button
              onClick={handleDelete}
              className="w-1/2 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
            >
              Delete Board
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
