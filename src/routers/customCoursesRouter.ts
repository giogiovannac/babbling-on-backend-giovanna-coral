import express from "express";
import { db } from "../database/firebase";
import { prisma } from "../database/prisma";
import { Request,Response } from "express";
const customCoursesRouter = express.Router();

// listens for HTTP requests and displays the course information
customCoursesRouter.get("/get", async (req:Request, res:Response) => {
    try{
            
        const course = await prisma.course.findMany({
            include: {
              lessons: true,
            },
          });
      
          if (!course) {
            res.status(404).json({ error: "Course not found" });
          } else {
            res.json(course);
          } 

    } catch (error) {
        res.status(500).send(`Internal server error: ${error}`);
    }
});

// listens for HTTP requests and sends course info to server 
customCoursesRouter.post("/post", async (req:Request, res:Response) => {
    try{

        // test 
        console.log(req.body);

        const {
            name,
            description,
        }: { name: string; description: string} = req.body;
      
          const result   = await prisma.course.create({
            data:{
               name,
               description
            },
            include:{ lessons:true} // include the lesson list
            })
            console.log(result)      
        // verify the userId has a role of tutor or teacher
        // if (userId !== tutor || teacher) {
        //     res.status(400).send("Bad request"); // edit error to role authentication error
        // }
          
        // after post request test
       
        res.status(201).json(result);
    } catch (error) {
        console.log(error)
        res.status(500).send(`Internal server error: ${error}`);
    }
});

//update course
customCoursesRouter.patch('/update/:id',async(req,res)=>{
    try {
        const { name, description } = req.body;
    
        const updatedCourse = await prisma.course.update({
          where: { id: req.params.id},
          data: {
            name,
            description,
          },
          include: {
            lessons: true,
          },
        });
    
        res.json(updatedCourse);
      } catch (error) {
        console.error("Error updating course:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
})

// delete a course
customCoursesRouter.delete('/delete/', async(req, res) => {
  try {
    console.log('Delete route handler invoked');
    
    const {customCourseId} = req.body;

    if (customCourseId == null){
      return res.status(400).json({error: "Course id is required"});
    }

    // check if the lesson with the specified id exists before trying to delete it
    const existingCourse = await prisma.course.findUnique({
      where: { id: customCourseId },
    });

    if (!existingCourse){
      return res.status(404).json({ error: 'Course not found' });
    }

    // if found delete the lesson
    await prisma.course.delete({
      where: { id: customCourseId },
    });

    res.json({ message: 'Course deleted succesfully' });
  }catch(error){
    console.error('Error deleting course', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default customCoursesRouter;
