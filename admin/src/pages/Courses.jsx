// src/pages/Course.jsx
import { useState } from "react";
import { FaBook, FaLayerGroup, FaUserTie, FaTrash, FaPlus, FaChevronDown } from "react-icons/fa";

export default function Course() {
  // Categories with subcategories
  const [categories, setCategories] = useState([
    { id: 1, name: "Web Development", subcategories: [{ id: 11, name: "Frontend" }, { id: 12, name: "Backend" }] },
    { id: 2, name: "Data Science", subcategories: [{ id: 21, name: "Python" }, { id: 22, name: "Machine Learning" }] },
  ]);

  // Courses linked to category & subcategory
  const [courses, setCourses] = useState([
    { id: 1, title: "React for Beginners", categoryId: 1, subcategoryId: 11, tutor: "John Doe" },
    { id: 2, title: "Python for Data Analysis", categoryId: 2, subcategoryId: 21, tutor: "Jane Smith" },
  ]);

  // Form states
  const [newCategory, setNewCategory] = useState("");
  const [newSubcategory, setNewSubcategory] = useState({ name: "", categoryId: "" });
  const [newCourse, setNewCourse] = useState({ title: "", categoryId: "", subcategoryId: "", tutor: "" });
  
  // UI states for toggling sections
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    subcategory: true,
    course: true,
    list: true
  });

  // Toggle section visibility
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Handlers
  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    setCategories([...categories, { id: Date.now(), name: newCategory.trim(), subcategories: [] }]);
    setNewCategory("");
  };

  const handleAddSubcategory = (e) => {
    e.preventDefault();
    if (!newSubcategory.name || !newSubcategory.categoryId) return;
    setCategories(
      categories.map((cat) =>
        cat.id === parseInt(newSubcategory.categoryId)
          ? { ...cat, subcategories: [...cat.subcategories, { id: Date.now(), name: newSubcategory.name }] }
          : cat
      )
    );
    setNewSubcategory({ name: "", categoryId: "" });
  };

  const handleAddCourse = (e) => {
    e.preventDefault();
    if (!newCourse.title || !newCourse.categoryId || !newCourse.subcategoryId || !newCourse.tutor) return;
    setCourses([...courses, { id: Date.now(), ...newCourse }]);
    setNewCourse({ title: "", categoryId: "", subcategoryId: "", tutor: "" });
  };

  const handleDeleteCategory = (id) => setCategories(categories.filter((cat) => cat.id !== id));
  const handleDeleteSubcategory = (categoryId, subId) => {
    setCategories(
      categories.map((cat) =>
        cat.id === categoryId
          ? { ...cat, subcategories: cat.subcategories.filter((sub) => sub.id !== subId) }
          : cat
      )
    );
    // Remove courses under that subcategory
    setCourses(courses.filter((c) => c.subcategoryId !== subId));
  };
  const handleDeleteCourse = (id) => setCourses(courses.filter((course) => course.id !== id));

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-lg">📚</span>
          <span>Course Management</span>
        </h1>
        <p className="text-gray-600 mt-2">Manage categories, subcategories, and courses</p>
      </header>

      {/* Add Category */}
      <section className="mb-6 bg-white p-6 rounded-2xl shadow-lg border border-gray-100 transition-all duration-300">
        <button 
          onClick={() => toggleSection('category')}
          className="w-full flex justify-between items-center text-left mb-4 focus:outline-none"
        >
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FaLayerGroup className="text-blue-600" />
            </div>
            Add New Category
          </h2>
          <FaChevronDown className={`transform transition-transform ${expandedSections.category ? 'rotate-180' : ''}`} />
        </button>
        
        {expandedSections.category && (
          <form onSubmit={handleAddCategory} className="flex flex-col md:flex-row gap-4 transition-all duration-300">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Category name"
              className="flex-1 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition flex items-center justify-center gap-2"
            >
              <FaPlus /> Add Category
            </button>
          </form>
        )}
      </section>

      {/* Add Subcategory */}
      <section className="mb-6 bg-white p-6 rounded-2xl shadow-lg border border-gray-100 transition-all duration-300">
        <button 
          onClick={() => toggleSection('subcategory')}
          className="w-full flex justify-between items-center text-left mb-4 focus:outline-none"
        >
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FaLayerGroup className="text-purple-600" />
            </div>
            Add New Subcategory
          </h2>
          <FaChevronDown className={`transform transition-transform ${expandedSections.subcategory ? 'rotate-180' : ''}`} />
        </button>
        
        {expandedSections.subcategory && (
          <form onSubmit={handleAddSubcategory} className="flex flex-col md:flex-row gap-4 transition-all duration-300">
            <select
              value={newSubcategory.categoryId}
              onChange={(e) => setNewSubcategory({ ...newSubcategory, categoryId: e.target.value })}
              className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <input
              type="text"
              value={newSubcategory.name}
              onChange={(e) => setNewSubcategory({ ...newSubcategory, name: e.target.value })}
              placeholder="Subcategory name"
              className="flex-1 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition flex items-center justify-center gap-2"
            >
              <FaPlus /> Add Subcategory
            </button>
          </form>
        )}
      </section>

      {/* Add Course */}
      <section className="mb-6 bg-white p-6 rounded-2xl shadow-lg border border-gray-100 transition-all duration-300">
        <button 
          onClick={() => toggleSection('course')}
          className="w-full flex justify-between items-center text-left mb-4 focus:outline-none"
        >
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <FaBook className="text-green-600" />
            </div>
            Add New Course
          </h2>
          <FaChevronDown className={`transform transition-transform ${expandedSections.course ? 'rotate-180' : ''}`} />
        </button>
        
        {expandedSections.course && (
          <form onSubmit={handleAddCourse} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 transition-all duration-300">
            <input
              type="text"
              value={newCourse.title}
              onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
              placeholder="Course title"
              className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
            />
            <select
              value={newCourse.categoryId}
              onChange={(e) => setNewCourse({ ...newCourse, categoryId: parseInt(e.target.value), subcategoryId: "" })}
              className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <select
              value={newCourse.subcategoryId}
              onChange={(e) => setNewCourse({ ...newCourse, subcategoryId: parseInt(e.target.value) })}
              className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
              disabled={!newCourse.categoryId}
            >
              <option value="">Select Subcategory</option>
              {newCourse.categoryId &&
                categories.find((cat) => cat.id === newCourse.categoryId)?.subcategories.map((sub) => (
                  <option key={sub.id} value={sub.id}>{sub.name}</option>
                ))
              }
            </select>
            <input
              type="text"
              value={newCourse.tutor}
              onChange={(e) => setNewCourse({ ...newCourse, tutor: e.target.value })}
              placeholder="Tutor name"
              className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all md:col-span-1 lg:col-span-1"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition flex items-center justify-center gap-2 md:col-span-2 lg:col-span-1"
            >
              <FaPlus /> Add Course
            </button>
          </form>
        )}
      </section>

      {/* Categories & Subcategories List */}
      <section className="mb-6 bg-white p-6 rounded-2xl shadow-lg border border-gray-100 transition-all duration-300">
        <button 
          onClick={() => toggleSection('list')}
          className="w-full flex justify-between items-center text-left mb-4 focus:outline-none"
        >
          <h2 className="text-xl font-semibold text-gray-800">📂 Categories & Subcategories</h2>
          <FaChevronDown className={`transform transition-transform ${expandedSections.list ? 'rotate-180' : ''}`} />
        </button>
        
        {expandedSections.list && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 transition-all duration-300">
            {categories.map((cat) => (
              <div key={cat.id} className="p-4 bg-gray-50 border border-gray-200 shadow-sm rounded-xl transition-all hover:shadow-md">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-medium text-gray-700 text-lg">{cat.name}</span>
                  <button
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="text-red-600 hover:text-red-800 flex items-center gap-1 text-sm bg-red-50 p-2 rounded-lg transition-all hover:bg-red-100"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
                <div className="pl-2">
                  {cat.subcategories.map((sub) => (
                    <div key={sub.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                      <span className="text-gray-600">- {sub.name}</span>
                      <button
                        onClick={() => handleDeleteSubcategory(cat.id, sub.id)}
                        className="text-red-500 hover:text-red-700 text-xs bg-red-50 p-1 rounded transition-all hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Courses Table */}
      <section className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">📘 Courses</h2>
        <div className="overflow-x-auto bg-white shadow-md rounded-xl">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="text-xs uppercase bg-gray-100">
              <tr>
                <th className="px-4 py-3 md:px-6">Title</th>
                <th className="px-4 py-3 md:px-6">Category</th>
                <th className="px-4 py-3 md:px-6 hidden md:table-cell">Subcategory</th>
                <th className="px-4 py-3 md:px-6">Tutor</th>
                <th className="px-4 py-3 md:px-6">Action</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => {
                const category = categories.find((c) => c.id === course.categoryId);
                const subcategory = category?.subcategories.find((sc) => sc.id === course.subcategoryId);
                return (
                  <tr key={course.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 md:px-6 font-medium">{course.title}</td>
                    <td className="px-4 py-4 md:px-6">{category?.name}</td>
                    <td className="px-4 py-4 md:px-6 hidden md:table-cell">{subcategory?.name}</td>
                    <td className="px-4 py-4 md:px-6 flex items-center gap-2">
                      <div className="bg-gray-100 p-2 rounded-full">
                        <FaUserTie className="text-gray-500 text-sm" />
                      </div>
                      <span>{course.tutor}</span>
                    </td>
                    <td className="px-4 py-4 md:px-6">
                      <button
                        onClick={() => handleDeleteCourse(course.id)}
                        className="text-red-600 hover:text-red-800 flex items-center gap-1 text-sm bg-red-50 py-2 px-3 rounded-lg transition-all hover:bg-red-100"
                      >
                        <FaTrash /> <span className="hidden sm:inline">Delete</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}