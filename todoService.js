import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { db } from "./firebase-config.js";

const COLLECTION_NAME = "todos";

// Add a new todo
export const addTodo = async (todoText) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      text: todoText,
      completed: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
};

// Get all todos
export const getTodos = async () => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const todos = [];
    
    querySnapshot.forEach((doc) => {
      todos.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return todos;
  } catch (e) {
    console.error("Error getting documents: ", e);
    throw e;
  }
};

// Update todo completion status
export const updateTodo = async (todoId, updates) => {
  try {
    const todoRef = doc(db, COLLECTION_NAME, todoId);
    await updateDoc(todoRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    console.log("Document updated successfully");
  } catch (e) {
    console.error("Error updating document: ", e);
    throw e;
  }
};

// Delete a todo
export const deleteTodo = async (todoId) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, todoId));
    console.log("Document deleted successfully");
  } catch (e) {
    console.error("Error deleting document: ", e);
    throw e;
  }
};