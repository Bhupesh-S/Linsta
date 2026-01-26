import { Types } from 'mongoose';
import { Group } from './group.model';
import { GroupMessage } from './groupmessage.model';

export class GroupService {
  /**
   * Create a new group
   * @param userId - User creating the group
   * @param name - Group name
   * @param description - Optional group description
   */
  static async createGroup(userId: string, name: string, description?: string): Promise<any> {
    try {
      if (!name || name.trim().length === 0) {
        throw { statusCode: 400, message: 'Group name is required' };
      }

      const group = await Group.create({
        name: name.trim(),
        description: description?.trim(),
        createdBy: new Types.ObjectId(userId),
        members: [new Types.ObjectId(userId)], // Creator is automatically a member
      });

      return {
        success: true,
        message: 'Group created successfully',
        data: group,
      };
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Get group by ID with member details
   */
  static async getGroup(groupId: string): Promise<any> {
    try {
      const group = await Group.findById(groupId)
        .populate('createdBy', 'name email')
        .populate('members', 'name email profilePicture')
        .lean();

      if (!group) {
        throw { statusCode: 404, message: 'Group not found' };
      }

      return group;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Add member to group
   */
  static async joinGroup(userId: string, groupId: string): Promise<any> {
    try {
      const group = await Group.findById(groupId);

      if (!group) {
        throw { statusCode: 404, message: 'Group not found' };
      }

      const userObjectId = new Types.ObjectId(userId);

      // Check if user already a member
      if (group.members.some(id => id.equals(userObjectId))) {
        throw { statusCode: 409, message: 'User is already a member of this group' };
      }

      group.members.push(userObjectId);
      await group.save();

      return {
        success: true,
        message: 'User joined group successfully',
        data: group,
      };
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Remove member from group
   */
  static async leaveGroup(userId: string, groupId: string): Promise<any> {
    try {
      const group = await Group.findById(groupId);

      if (!group) {
        throw { statusCode: 404, message: 'Group not found' };
      }

      const userObjectId = new Types.ObjectId(userId);

      // Check if user is a member
      const memberIndex = group.members.findIndex(id => id.equals(userObjectId));
      if (memberIndex === -1) {
        throw { statusCode: 404, message: 'User is not a member of this group' };
      }

      // Remove member
      group.members.splice(memberIndex, 1);
      await group.save();

      return {
        success: true,
        message: 'User left group successfully',
      };
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Check if user is member of group
   */
  static async isMember(userId: string, groupId: string): Promise<boolean> {
    try {
      const group = await Group.findById(groupId);

      if (!group) {
        return false;
      }

      const userObjectId = new Types.ObjectId(userId);
      return group.members.some(id => id.equals(userObjectId));
    } catch (error: any) {
      return false;
    }
  }

  /**
   * Get user's groups
   */
  static async getUserGroups(userId: string, limit: number = 100, skip: number = 0): Promise<any> {
    try {
      const userObjectId = new Types.ObjectId(userId);

      const groups = await Group.find({
        members: userObjectId,
      })
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .lean();

      const total = await Group.countDocuments({
        members: userObjectId,
      });

      return {
        data: groups,
        pagination: { total, limit, skip, hasMore: skip + limit < total },
      };
    } catch (error: any) {
      throw error;
    }
  }
}
