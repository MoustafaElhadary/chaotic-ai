"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";
import React from "react";
import { useFlowContext } from "@/app/(app)/flow/components/FlowContext";

interface Step {
  id: string;
  description: string;
}

export function SortableItem({
  id,
  step,
  index,
}: {
  id: string;
  step: Step;
  index: number;
}) {
  const { form } = useFlowContext();
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const updateStep = (id: string, description: string) => {
    const currentSteps = form.getValues("steps");
    form.setValue(
      "steps",
      currentSteps.map((step) =>
        step.id === id ? { ...step, description } : step
      )
    );
  };

  const deleteStep = (id: string) => {
    const currentSteps = form.getValues("steps");
    form.setValue(
      "steps",
      currentSteps.filter((step) => step.id !== id)
    );
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div className="mb-2 flex items-center relative group bg-background border rounded-md p-2">
        <div className="mr-2 cursor-move" {...listeners}>
          <GripVertical size={20} />
        </div>
        <div className="flex-grow relative">
          <div className="flex items-center mt-1">
            <Textarea
              value={step.description}
              onChange={(e) => updateStep(step.id, e.target.value)}
              placeholder={`Describe step ${index + 1}`}
              onPointerDown={(e) => e.stopPropagation()}
              className="pr-10 min-h-[5px]"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => deleteStep(step.id)}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export const StepList: React.FC = () => {
  const { form } = useFlowContext();
  const steps = form.watch("steps");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = steps.findIndex((item) => item.id === active.id);
      const newIndex = steps.findIndex((item) => item.id === over.id);
      form.setValue("steps", arrayMove(steps, oldIndex, newIndex));
    }
  };

  const addStep = (index: number) => {
    const newSteps = [...steps];
    newSteps.splice(index + 1, 0, {
      id: Date.now().toString(),
      description: "",
    });
    form.setValue("steps", newSteps);
  };

  return (
    <div className="mt-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={steps} strategy={verticalListSortingStrategy}>
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <SortableItem id={step.id} step={step} index={index} />
              <div className="relative h-4 group">
                <div
                  onClick={() => addStep(index)}
                  className={`absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-black bg-opacity-80 rounded-full flex items-center justify-center cursor-pointer transition-opacity ${"opacity-0 group-hover:opacity-100"}`}
                >
                  <span className="text-white text-xs">+</span>
                </div>
              </div>
            </React.Fragment>
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};
