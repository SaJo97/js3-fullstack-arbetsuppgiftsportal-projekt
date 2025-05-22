import { Header } from "@/components/header"
import { AllUsersTasksList } from "./_components/all-users-tasks-list"


const AllTasksPage = () => {
  return (
    <>
      <Header />
      <div className="mt-10 flex gap-4 overflow-x-auto pb-20"> {/*flex-wrap*/}
        <AllUsersTasksList />
      </div>
    </>

  )
}
export default AllTasksPage