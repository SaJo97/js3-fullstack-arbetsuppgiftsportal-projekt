import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskList } from '../task-list';

// Mock Task component to simplify testing TaskList
jest.mock("../task", () => ({
  Task: ({ task, handleComplete, index, accentColor }) => (
    <div
      data-testid="task"
      data-taskid={task.id}
      data-index={index}
      data-accentcolor={accentColor}
      onClick={() => handleComplete(task.id)}
    >
      {task.title}
    </div>
  ),
}))

describe("TaskList", () => {
  const sampleTasks = [
    { id: "1", title: "Task 1" },
    { id: "2", title: "Task 2" },
    { id: "3", title: "Task 3" },
  ]
  
  const accentColor = "blue"
  
  it("renders Task components for each task and passes props correctly", () => {
    const handleComplete = jest.fn()
    
    render(<TaskList tasks={sampleTasks} handleComplete={handleComplete} accentColor={accentColor} />)
    
    const tasks = screen.getAllByTestId("task")
    expect(tasks).toHaveLength(sampleTasks.length)
    
    tasks.forEach((taskElement, index) => {
      expect(taskElement).toHaveTextContent(sampleTasks[index].title)
      expect(taskElement).toHaveAttribute("data-taskid", sampleTasks[index].id)
      expect(taskElement).toHaveAttribute("data-index", index.toString())
      expect(taskElement).toHaveAttribute("data-accentcolor", accentColor)
    })
    
    // Test that clicking a task calls handleComplete with task id
    fireEvent.click(tasks[0])
    expect(handleComplete).toHaveBeenCalledWith("1")
  })
})

