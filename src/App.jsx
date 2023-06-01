// import ReactMde from "react-mde";
import React, { useState, useEffect } from "react"
import Sidebar from "./Sidebar"
import Editor from "./Editor"
// import { data } from "./data"
import Split from "react-split"
import {nanoid} from "nanoid"
// import { useEffect } from "react";
import './App.css'
import 'react-mde/lib/styles/css/react-mde-all.css';
import { onSnapshot , addDoc, doc, deleteDoc, setDoc} from "firebase/firestore";
import { noteCollection, db } from "./Firebase";


export default function App() {
    const [notes, setNotes] = React.useState([])
    const [currentNoteId, setCurrentNoteId] = React.useState("")


        const currentNote = 
        notes.find(note => note.id === currentNoteId) 
        || notes[0]


    const arraySorter = notes.sort((a,b)=>  b.updatedAt - a.updatedAt )

    const [tempNoteText, setTempNoteText] = useState('')



    // console.log(notes[0].id)
    useEffect(() => {
        const unsubscribe = onSnapshot(noteCollection, function(snapshot) {
            // Sync up our local notes array with the snapshot data
            const notesArr = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }))
            setNotes(notesArr)
        })
        return unsubscribe
    }, [])  

    useEffect(() => {
        if (!currentNoteId) {
            setCurrentNoteId(notes[0]?.id)
        }
    }, [notes])

    useEffect(()=>
    {
        if(currentNote)
        {
            setTempNoteText(currentNote.body)
        }
    }, [currentNote])

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (tempNoteText !== currentNote.body) {
                updateNote(tempNoteText)
            }
        }, 500)
        return () => clearTimeout(timeoutId)
    }, [tempNoteText])
     
    async function createNewNote() {
        const newNote = {
            body: "# Type your markdown note's title here",
            createdAt:  Date.now(),
            updatedAt: Date.now()
        }
        const newNoteRef = await addDoc(noteCollection, newNote)
        setCurrentNoteId(newNoteRef.id)
    }
    
    async function updateNote(text) {
        const docRef = doc(db, 'notes', currentNoteId)  
        await setDoc(docRef, {body: text, updatedAt: Date.now()}, {merge: true})
    }


    async function deleteNote(noteId) {
     const docRef = doc(db, 'notes', noteId)  
     await deleteDoc(docRef)

    }
    
    
    function findCurrentNote() {
       
        return notes.find(note => {
            return note.id === currentNoteId
        }) || notes[0]
    }
    
    return (
        <main>
        {
            notes.length > 0 
            ?
            <Split 
                sizes={[30, 70]} 
                direction="horizontal" 
                className="split"
            >
                <Sidebar
                    notes={notes}
                    currentNote={currentNote }
                    setCurrentNoteId={setCurrentNoteId}
                    newNote={createNewNote}
                    deleteNote={deleteNote}
                />
                {
                    <Editor 
                    tempNoteText={tempNoteText}
                    setTempNoteText={setTempNoteText}
                    />
                }
            </Split>
            :
            <div className="no-notes">
                <h1>You have no notes</h1>
                <button 
                    className="first-note" 
                    onClick={createNewNote}
                >
                    Create one now
                </button>
            </div>
            
        }
        </main>
    )
}
