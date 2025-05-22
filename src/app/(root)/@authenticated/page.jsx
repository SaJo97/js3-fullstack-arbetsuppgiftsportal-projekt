"use client"
import { Header } from "@/components/header"
import { TaskColumn } from "@/components/tasks/task-column"
import { useAuth } from "@/context/authContext"
import { isValid, parse } from "date-fns"
import { useSearchParams } from "next/navigation"

const HomePage = () => {
// Accessing search parameters from the URL
    const searchParams = useSearchParams()
    // Getting the 'date' parameter from the search parameters
    const date = searchParams.get("date") 
    // Parsing the date string into a Date object; if no date is provided, use the current date
    const parsed = date
      ? parse(date, 'yyyy-MM-dd', new Date()) // Parse the date string if it exists
      : new Date() // Default to the current date if no date is provided
    // Validating the parsed date; if invalid, fallback to the current date
    const selectedDate = isValid(parsed) ? parsed : new Date()

    const {user} = useAuth()
  return (
    <>
      <Header />
      <div className="mt-10 pb-20">
        <TaskColumn date={selectedDate} user={user}/>
      </div>
    </>
  )
}
export default HomePage