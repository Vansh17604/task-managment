import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "react-query";
import {  useParams } from "react-router-dom";
import * as apiClient from "../api-client"; // Ensure this includes the API methods for boards
import { useAppContext } from "@/context/AppContext";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";

export type BoardFormData = {
  id?: string;
  name: string;
};

export const BoardForm = () => {
  const { showToast } = useAppContext();
  const queryClient = useQueryClient();
  const { boardId } = useParams();

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<BoardFormData>({
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (boardId) {
      const fetchBoard = async () => {
        try {
          const board = await apiClient.getBoard(boardId);
          setValue("name", board.name);
        } catch (error) {
          console.error("Error fetching board:", error);
        }
      };
      fetchBoard();
    }
  }, [boardId, setValue]);

  const createBoardMutation = useMutation(apiClient.createBoard, {
    onSuccess: (newBoard) => {
      showToast({ message: "Board created successfully!", type: "SUCCESS" });
      queryClient.invalidateQueries("boards");
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  const onSubmit = handleSubmit((data) => {
    createBoardMutation.mutate(data.name);
  });

  return (
    <div className="flex justify-center items-center bg-gray-100 py-8">
      <div className="max-w-md mx-auto p-5 bg-white shadow-md rounded-md border border-gray-300">
        <h2 className="text-2xl font-semibold text-center mb-4">Create New Board</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Board Name
            </Label>
            <Input
              id="name"
              type="text"
              {...register("name", { required: "This field is required" })}
              className="w-full mt-1"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          <div>
            <Button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
              Create Board
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
