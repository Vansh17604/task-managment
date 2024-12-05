import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import * as apiClient from "../api-client";
import { useAppContext } from "@/context/AppContext";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";


export type Task = {
  title: string;
  description?: string; 
  status?: string;
};

export type BoardFormData = {
  id?: string;
  name: string;
  task: Task[]; 
};

export const BoardForm = () => {
  const { showToast } = useAppContext();
  const queryClient = useQueryClient();
  const { boardId } = useParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm<BoardFormData>({
    defaultValues: {
      name: "",
      task: [
        {
          title: "",
          description: "",
          status: "TODO",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "task",
  });

  useEffect(() => {
    if (boardId) {
      const fetchBoard = async () => {
        try {
          const board = await apiClient.getBoard(boardId);
          setValue("name", board.name);
          setValue(
            "task",
            board.task.map((task: apiClient.Task) => ({
              title: task.title,
              description: task.description || "",
              status: task.status || "TODO",
            }))
          );
        } catch (error) {
          console.error("Error fetching board:", error);
        }
      };
      fetchBoard();
    }
  }, [boardId, setValue]);

  const createBoardMutation = useMutation(
    (data: BoardFormData) => {
      const processedTasks: apiClient.Task[] = data.task.map((task) => ({
        title: task.title,
        description: task.description || "",
        status: task.status || "TODO",
      }));

      return apiClient.createBoard(data.name, processedTasks);
    },
    {
      onSuccess: () => {
        showToast({ message: "Board created successfully!", type: "SUCCESS" });
        queryClient.invalidateQueries("boards");
      },
      onError: (error: Error) => {
        showToast({ message: error.message, type: "ERROR" });
      },
    }
  );

  const onSubmit = handleSubmit((data) => {
    createBoardMutation.mutate(data);
  });

  return (
    <div className="flex justify-center items-center bg-gray-100 py-10">
      <div className="max-w-2xl mx-auto p-8 bg-white shadow-lg rounded-md border border-gray-300">
        <h2 className="text-3xl font-semibold text-center mb-6">Create New Board</h2>
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name" className="block text-lg font-medium text-gray-700">
              Board Name
            </Label>
            <Input
              id="name"
              type="text"
              {...register("name", { required: "This field is required" })}
              className="w-full mt-2"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          
          <div>
            <Label htmlFor="tasks" className="block text-lg font-medium text-gray-700">
              Tasks
            </Label>
            <div className="space-y-4 mt-4">
              {fields.map((field, index) => (
                <div key={field.id} className="space-y-2 p-4 bg-gray-100 rounded-md shadow-sm">
                  <Input
                    {...register(`task.${index}.title`, { required: "Task title is required" })}
                    className="w-full"
                    placeholder={`Task ${index + 1} Title`}
                  />
                  <Input
                    {...register(`task.${index}.description`)}
                    className="w-full"
                    placeholder={`Task ${index + 1} Description`}
                  />
                  <Input
                    {...register(`task.${index}.status`)}
                    className="w-full"
                    placeholder={`Task ${index + 1} Status`}
                  />
                  <Button
                    type="button"
                    className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600"
                    onClick={() => remove(index)}
                  >
                    Remove Task
                  </Button>
                </div>
              ))}
            </div>
            <Button
              type="button"
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              onClick={() =>
                append({
                  title: "",
                  description: "",
                  status: "TODO",
                })
              }
            >
              + Add Task
            </Button>
          </div>

          
          <div>
            <Button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600"
            >
              Create Board
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BoardForm;