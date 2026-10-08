import { createContext, useCallback } from "react";
import { useState,useContext,useEffect } from "react";
import api from "../Api/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AppContext = createContext(undefined)

export function AppContextProvider({children}){

    //Auth States
    const [user,setUser] = useState(null);
    //user is null display register/login page
    //user is not null display dashboard / builder page 


    const [loadingUser,setLoadingUser] = useState(true);

    //States
    const [projects,setProjects] = useState([]);
    const [loadingProjects,setLoadingProjects] = useState(true);
    const [activeProject,setActiveProject] = useState(null);
    const [loadingActiveProject,setLoadingActiveProject] = useState(true);
    const [chatLoading, setChatLoading] = useState(false);
    const [generatingProject, setGeneratingProject] = useState(false);
    const [activeFile,setActiveFile] = useState("/App.js");
    const [showCode,setShowCode] = useState(false);


    const navigate = useNavigate()
    //Auth Actions 
    const checkSession = async()=>{
        try{
            const {data} = await api.get("/api/auth/me");
            setUser(data.user);
        }
        catch(error)
        {
            setUser(null);
        }
        finally{
            setLoadingUser(false);
        }
    }

    useEffect(()=>{
        checkSession()
    },[checkSession])

    const login = async(email, password)=>{
        try{
            const {data} = await api.post("/api/auth/login",{email,password});
            setUser(data.user)
            toast.success("Welcome back! ");
            navigate("/")
        }
        catch(error){
            console.log("Login error ",error)
            const errMsg = error?.response?.data?.error || "Invalid email or password";

            toast.error(errMsg);

            throw new Error(errMsg)
        }
    }

    const register = async(name, email, password)=>{
        try{
            const {data} = await api.post("/api/auth/register",{name,email,password});
            setUser(data.user)
            toast.success("Account created successfully!");
            navigate("/")
        }
        catch(error){
            console.log("Registration failed ",error)
            const errMsg = error?.response?.data?.error || "Registration failed";

            toast.error(errMsg);

            throw new Error(errMsg)
        }
    }

    const logout = async()=>{
        try{
            await api.post("/api/auth/logout")
            setUser(null);
            setProjects([])
            setActiveProject(null)
            toast.success("Logged out successfully")
            navigate("/login")
        }
        catch(error){
            console.log(error)
            toast.error(error)
        }
        finally{

        }
    }

    //Projects Action
    const loadProjects = async()=>{
        if(!user) return;

        try{
            const {data} = await api.get("/api/projects")
            setProjects(data)
        }
        catch(error)
        {
            console.error("Failed to fetch projects", error)
            toast.error("Failed to fetch projects")
        }
        finally{
            setLoadingProjects(false)
        }
    }

    const loadProject = async(id,slient = false)=>{
        if(!user) return;

        if(!slient) setLoadingActiveProject(true)

            try{
            const {data} = await api.get(`/api/projects/${id}`)
            setActiveProject(data)

            //Default file selection
            const files = Object.keys(data.files);

            if(files.length > 0)
            {
                setActiveFile((prev)=>{

                    if(files.includes(prev)) return prev;

                    if(files.includes("/App.js")) return "/App.js";

                    return files[0];
                })
            }
            }
            catch(error){
                console.error("Failed to load Project ",error);

                if(!slient)
                {
                    toast.error("Failed to load Project Details");
                    navigate("/");
                }
            }
            finally{
                if(!slient) setLoadingActiveProject(false)
            }
    }

    //Automatically call Active project status if pending or generating

    useEffect(()=>{

        if(!activeProject?._id || !user) return;

        const isOngoing = activeProject.status === "generating" || activeProject.status === "pending" ||
        activeProject.status === "revising";

        if(isOngoing)
        {
            setChatLoading(true);
            const interval = setInterval(()=>{
                loadProject(activeProject._id,true)
            },2000)

            return ()=> clearInterval(interval)
        }
        else
        {
            setChatLoading(false);
        }
    },[activeProject?._id, activeProject?.status, loadProject, user])

    const handleGenerate = useCallback(
        async(prompt)=>{

            if(!user) return;

            setGeneratingProject(true);

            try{
                const {data} = await api.post("/api/projects", {prompt});

                toast.success("AI Agent is planning structure...");

                navigate(`/builder/${data._id}`);
            }
            catch(error)
            {
                console.error("Failed to generate project",error);
                toast.error(error?.response?.data?.error || "Failed to generate project");
            }
            finally{
                setGeneratingProject(false);
            }
        },[navigate,user]
    )

    const handleDelete = useCallback(
        async(id)=>{

            if(!user) return;

            try{
                const {data} = await api.delete(`/api/projects/${id}`);
                setProjects((prev)=> prev.filter((p)=> p._id!==id))
                toast.success("Project deleted Successfully")
            }
            catch(error)
            {
                console.error("Failed to delete project",error);
                toast.error("Failed to delete project");
            }
        },[user]
    )

    return (
        <AppContext.Provider value={{user,
        loadingUser,
        login,
        register,
        projects,
        loadingProjects,
        activeProject,
        loadingActiveProject,
        chatLoading,
        generatingProject,
        activeFile,
        showCode,
        setActiveFile,
        setShowCode,
        loadProjects,
        loadProject,
        handleGenerate,
        handleDelete,
        logout
        }}>
            {children}
        </AppContext.Provider>
    )
}

export function useAppContext(){
    const context = useContext(AppContext);
    if(context==undefined)
    {
        throw new Error("useAppContext must be used within an AppContext Provider")
    }

    return context;
}