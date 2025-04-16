import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

// Debug helper to view current state
function debugDatabaseState() {
  const { assignments } = Database;
  console.log(`Current database state: ${assignments.length} course assignment groups`);
  assignments.forEach(course => {
    console.log(`Course: ${course.course}, Assignments: ${course.assignments.length}`);
    course.assignments.forEach(assignment => {
      console.log(`  - ${assignment._id}: ${assignment.title}`);
    });
  });
}

// Find all assignments
export const findAllAssignments = () => {
  return model.find();
};

// Find assignments for a specific course
export const findAssignmentsForCourse = (courseId) => {
  return model.find({ course: courseId });
};

// Find a specific assignment by ID
export const findAssignmentById = (assignmentId) => {
  return model.findById(assignmentId);
};

// Create a new assignment
export const createAssignment = (assignment) => {
  // Generate a unique ID if not provided
  const newAssignment = { 
    ...assignment, 
    _id: assignment._id || uuidv4() 
  };
  return model.create(newAssignment);
};

// Update an existing assignment
export const updateAssignment = async (assignmentId, assignmentUpdates) => {
  console.log(`DAO: Updating assignment ${assignmentId} with data:`, assignmentUpdates);
  
  try {
    // 确保传入的 _id 字段与参数一致
    if (assignmentUpdates._id && assignmentUpdates._id !== assignmentId) {
      console.warn(`DAO: Warning - Passed _id in body (${assignmentUpdates._id}) differs from URL parameter (${assignmentId})`);
      // 使用 URL 参数中的 ID 作为主要标识
    }
    
    // 移除 __v 字段（如果存在），这可能会导致冲突
    if (assignmentUpdates.__v !== undefined) {
      delete assignmentUpdates.__v;
    }

    // 记录当前数据库状态
    const existingAssignment = await model.findById(assignmentId);
    console.log(`DAO: Current assignment state:`, existingAssignment);
    
    if (!existingAssignment) {
      console.error(`DAO: Assignment ${assignmentId} not found before update`);
      throw new Error(`Assignment ${assignmentId} not found`);
    }
    
    // 创建一个包含所有必要字段的完整对象
    // 这将确保我们不会丢失任何现有字段
    const fullUpdateObject = {
      ...existingAssignment.toObject(),
      ...assignmentUpdates,
      // 确保 _id 不变
      _id: assignmentId
    };
    
    console.log("DAO: Full update object:", fullUpdateObject);
    
    // 使用 replaceOne 完全替换文档，避免部分更新问题
    const replaceResult = await model.replaceOne(
      { _id: assignmentId },
      fullUpdateObject
    );
    
    console.log(`DAO: Replace result:`, replaceResult);
    
    if (replaceResult.modifiedCount === 0) {
      console.error(`DAO: Assignment ${assignmentId} not modified during update`);
      // 尝试备用方法
      console.log("DAO: Trying alternative update method...");
      
      // 使用 findOneAndUpdate 作为备选方案
      const result = await model.findOneAndUpdate(
        { _id: assignmentId }, 
        { $set: assignmentUpdates },
        { 
          new: true, // 返回更新后的文档而不是原始文档
          runValidators: true, // 运行模式验证
          upsert: false, // 不创建新文档
          useFindAndModify: false // 使用新的 API
        }
      );
      
      console.log(`DAO: Alternative update result:`, result);
      
      if (!result) {
        console.error(`DAO: Assignment ${assignmentId} not found in alternative update`);
        throw new Error(`Assignment ${assignmentId} not found`);
      }
      
      // 再次验证更新是否成功
      const verifyUpdate = await model.findById(assignmentId);
      console.log(`DAO: Verified assignment after alternative update:`, verifyUpdate);
      
      return result;
    }
    
    // 获取更新后的文档
    const updatedAssignment = await model.findById(assignmentId);
    console.log(`DAO: Updated assignment:`, updatedAssignment);
    
    // 验证更新是否成功
    if (!updatedAssignment) {
      console.error(`DAO: Assignment ${assignmentId} not found after update`);
      throw new Error(`Assignment ${assignmentId} not found after update`);
    }
    
    // 再次验证更新是否成功
    const verifyUpdate = await model.findById(assignmentId);
    console.log(`DAO: Verified assignment after update:`, verifyUpdate);
    
    return updatedAssignment;
  } catch (error) {
    console.error(`DAO: Error updating assignment ${assignmentId}:`, error);
    throw error;
  }
};

// Delete an assignment
export const deleteAssignment = (assignmentId) => {
  return model.deleteOne({ _id: assignmentId });
}; 