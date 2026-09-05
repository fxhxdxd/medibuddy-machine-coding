import { Route, Routes } from "react-router"
import MedicineDetailPage from "@/pages/MedicineDetailPage"
import SearchPage from "@/pages/SearchPage"

function App() {
  return (
    <Routes>
      <Route path="/" element={<SearchPage />} />
      <Route
        path="/medicine/:id"
        element={<MedicineDetailPage />}
      />
    </Routes>
  )
}

export default App