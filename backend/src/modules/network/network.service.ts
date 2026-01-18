// Network service - business logic for connections, follows, communities
import { Types } from "mongoose";
import { User } from "../users/user.model";
import { UserProfile } from "../users/profile.model";
import { Connection } from "./connection.model";
import { ConnectionRequest } from "./connection-request.model";
import { Follow } from "./follow.model";
import { Block } from "./block.model";
import { Community } from "./community.model";
import { CommunityMember } from "./community-member.model";

// DTOs returned to frontend
export type ConnectionStatus =
  | "none"
  | "requested"
  | "pending"
  | "connected"
  | "blocked";

export type FollowStatus =
  | "not_following"
  | "following"
  | "followed_by"
  | "mutual";

export interface NetworkUserDTO {
  id: string;
  name: string;
  role: string;
  organization: string;
  skills: string[];
  avatarUrl?: string;
  location?: string;
  bio?: string;
  connectionStatus: ConnectionStatus;
  followStatus: FollowStatus;
}

export interface CommunityDTO {
  id: string;
  name: string;
  category?: string;
  description?: string;
  memberCount: number;
  isJoined: boolean;
}

export interface ConnectionRequestDTO {
  id: string;
  user: NetworkUserDTO;
  timestamp: string;
  message?: string;
}

export interface NetworkStatsDTO {
  connectionsCount: number;
  followersCount: number;
  followingCount: number;
  pendingRequestsCount: number;
}

export class NetworkService {
  // Helper: compute connection + follow status between current user and target
  private static async getRelationshipStatus(
    currentUserId: Types.ObjectId,
    targetUserId: Types.ObjectId
  ): Promise<{ connectionStatus: ConnectionStatus; followStatus: FollowStatus }> {
    // Block check
    const block = await Block.findOne({
      userId: currentUserId,
      blockedUserId: targetUserId,
    });
    if (block) {
      return { connectionStatus: "blocked", followStatus: "not_following" };
    }

    // Connections
    const connection = await Connection.findOne({
      $or: [
        { user1Id: currentUserId, user2Id: targetUserId },
        { user1Id: targetUserId, user2Id: currentUserId },
      ],
    });

    // Pending requests
    const outgoingReq = await ConnectionRequest.findOne({
      fromUserId: currentUserId,
      toUserId: targetUserId,
      status: "pending",
    });

    const incomingReq = await ConnectionRequest.findOne({
      fromUserId: targetUserId,
      toUserId: currentUserId,
      status: "pending",
    });

    let connectionStatus: ConnectionStatus = "none";
    if (connection) {
      connectionStatus = "connected";
    } else if (outgoingReq) {
      connectionStatus = "requested";
    } else if (incomingReq) {
      connectionStatus = "pending";
    }

    // Follows
    const iFollow = await Follow.findOne({
      followerId: currentUserId,
      followingId: targetUserId,
    });
    const followsMe = await Follow.findOne({
      followerId: targetUserId,
      followingId: currentUserId,
    });

    let followStatus: FollowStatus = "not_following";
    if (iFollow && followsMe) {
      followStatus = "mutual";
    } else if (iFollow) {
      followStatus = "following";
    } else if (followsMe) {
      followStatus = "followed_by";
    }

    return { connectionStatus, followStatus };
  }

  // Helper: build NetworkUserDTO from User + Profile
  private static async buildNetworkUserDTO(
    currentUserId: Types.ObjectId,
    targetUserId: Types.ObjectId
  ): Promise<NetworkUserDTO | null> {
    const user = await User.findById(targetUserId);
    if (!user) return null;

    const profile = await UserProfile.findOne({ userId: targetUserId });
    const { connectionStatus, followStatus } = await this.getRelationshipStatus(
      currentUserId,
      targetUserId
    );

    // Derive basic fields from profile where possible
    const organization = profile?.university || "";
    const skills = profile?.skills || [];

    // For now, derive a simple role based on presence of university/year
    let role = "student";
    if (!profile?.university) {
      role = "member";
    }

    return {
      id: user._id.toString(),
      name: user.name,
      role,
      organization,
      skills,
      avatarUrl: profile?.profileImageUrl,
      location: undefined,
      bio: undefined,
      connectionStatus,
      followStatus,
    };
  }

  // Get suggested users (basic implementation: all other users)
  static async getSuggestions(currentUserId: string): Promise<{
    users: NetworkUserDTO[];
    total: number;
  }> {
    const currentId = new Types.ObjectId(currentUserId);

    const users = await User.find({ _id: { $ne: currentId } })
      .sort({ createdAt: -1 })
      .limit(50);

    const dtos: NetworkUserDTO[] = [];
    for (const u of users) {
      const dto = await this.buildNetworkUserDTO(currentId, u._id);
      if (dto) dtos.push(dto);
    }

    return { users: dtos, total: dtos.length };
  }

  // Search users by name/email/skills
  static async searchUsers(
    currentUserId: string,
    query: string,
    filters?: { role?: string; location?: string; skills?: string[] }
  ): Promise<{ users: NetworkUserDTO[]; total: number }> {
    const currentId = new Types.ObjectId(currentUserId);

    const regex = query ? new RegExp(query, "i") : null;

    const users = await User.find(
      regex
        ? {
            _id: { $ne: currentId },
            $or: [{ name: regex }, { email: regex }],
          }
        : { _id: { $ne: currentId } }
    ).limit(50);

    const dtos: NetworkUserDTO[] = [];
    for (const u of users) {
      const dto = await this.buildNetworkUserDTO(currentId, u._id);
      if (!dto) continue;

      // Basic skill filter using profile skills
      if (filters?.skills && filters.skills.length > 0) {
        const hasSkill = filters.skills.some((s) => dto.skills.includes(s));
        if (!hasSkill) continue;
      }

      dtos.push(dto);
    }

    return { users: dtos, total: dtos.length };
  }

  // Send connection request
  static async sendConnectionRequest(
    currentUserId: string,
    targetUserId: string,
    message?: string
  ): Promise<{ success: boolean; requestId: string; message: string }> {
    const fromId = new Types.ObjectId(currentUserId);
    const toId = new Types.ObjectId(targetUserId);

    if (fromId.equals(toId)) {
      throw new Error("Cannot connect to yourself");
    }

    // Check existing connection
    const existingConnection = await Connection.findOne({
      $or: [
        { user1Id: fromId, user2Id: toId },
        { user1Id: toId, user2Id: fromId },
      ],
    });
    if (existingConnection) {
      return {
        success: true,
        requestId: "",
        message: "Already connected",
      };
    }

    // Check existing pending request
    const existingReq = await ConnectionRequest.findOne({
      fromUserId: fromId,
      toUserId: toId,
      status: "pending",
    });
    if (existingReq) {
      return {
        success: true,
        requestId: existingReq._id.toString(),
        message: "Request already sent",
      };
    }

    const request = await ConnectionRequest.create({
      fromUserId: fromId,
      toUserId: toId,
      message,
      status: "pending",
    });

    return {
      success: true,
      requestId: request._id.toString(),
      message: "Connection request sent successfully",
    };
  }

  // Respond to connection request
  static async respondToRequest(
    currentUserId: string,
    requestId: string,
    action: "accept" | "reject"
  ): Promise<{ success: boolean; message: string }> {
    const reqDoc = await ConnectionRequest.findOne({
      _id: new Types.ObjectId(requestId),
      toUserId: new Types.ObjectId(currentUserId),
      status: "pending",
    });

    if (!reqDoc) {
      throw new Error("Request not found");
    }

    if (action === "accept") {
      reqDoc.status = "accepted";
      await reqDoc.save();

      const user1Id = reqDoc.fromUserId;
      const user2Id = reqDoc.toUserId;

      const [a, b] = [user1Id, user2Id].sort();
      await Connection.updateOne(
        { user1Id: a, user2Id: b },
        { $setOnInsert: { user1Id: a, user2Id: b, createdAt: new Date() } },
        { upsert: true }
      );

      return { success: true, message: "Connection request accepted" };
    } else {
      reqDoc.status = "rejected";
      await reqDoc.save();
      return { success: true, message: "Connection request rejected" };
    }
  }

  // Remove connection
  static async removeConnection(
    currentUserId: string,
    otherUserId: string
  ): Promise<{ success: boolean; message: string }> {
    const currentId = new Types.ObjectId(currentUserId);
    const otherId = new Types.ObjectId(otherUserId);

    await Connection.deleteOne({
      $or: [
        { user1Id: currentId, user2Id: otherId },
        { user1Id: otherId, user2Id: currentId },
      ],
    });

    return { success: true, message: "Connection removed successfully" };
  }

  // Get communities
  static async getCommunities(currentUserId: string): Promise<{
    communities: CommunityDTO[];
    total: number;
  }> {
    const currentId = new Types.ObjectId(currentUserId);

    const communities = await Community.find().sort({ name: 1 }).limit(50);

    const dtos: CommunityDTO[] = [];
    for (const c of communities) {
      const memberCount = await CommunityMember.countDocuments({
        communityId: c._id,
      });
      const isMember = await CommunityMember.findOne({
        communityId: c._id,
        userId: currentId,
      });

      dtos.push({
        id: c._id.toString(),
        name: c.name,
        category: c.category,
        description: c.description,
        memberCount,
        isJoined: !!isMember,
      });
    }

    return { communities: dtos, total: dtos.length };
  }

  static async joinCommunity(
    currentUserId: string,
    communityId: string
  ): Promise<{ success: boolean; message: string }> {
    const currentId = new Types.ObjectId(currentUserId);
    const commId = new Types.ObjectId(communityId);

    await CommunityMember.updateOne(
      { communityId: commId, userId: currentId },
      { $setOnInsert: { communityId: commId, userId: currentId, role: "member" } },
      { upsert: true }
    );

    return { success: true, message: "Successfully joined community" };
  }

  static async leaveCommunity(
    currentUserId: string,
    communityId: string
  ): Promise<{ success: boolean; message: string }> {
    const currentId = new Types.ObjectId(currentUserId);
    const commId = new Types.ObjectId(communityId);

    await CommunityMember.deleteOne({ communityId: commId, userId: currentId });
    return { success: true, message: "Successfully left community" };
  }

  static async checkMessagingPermission(
    currentUserId: string,
    targetUserId: string
  ): Promise<{ canMessage: boolean; reason?: string }> {
    const currentId = new Types.ObjectId(currentUserId);
    const targetId = new Types.ObjectId(targetUserId);

    const block = await Block.findOne({
      userId: currentId,
      blockedUserId: targetId,
    });
    if (block) {
      return { canMessage: false, reason: "You have blocked this user" };
    }

    const connection = await Connection.findOne({
      $or: [
        { user1Id: currentId, user2Id: targetId },
        { user1Id: targetId, user2Id: currentId },
      ],
    });

    if (!connection) {
      return {
        canMessage: false,
        reason: "You must be connected to message this user",
      };
    }

    return { canMessage: true };
  }

  static async getConnectionRequests(
    currentUserId: string
  ): Promise<ConnectionRequestDTO[]> {
    const currentId = new Types.ObjectId(currentUserId);

    const requests = await ConnectionRequest.find({
      toUserId: currentId,
      status: "pending",
    }).sort({ createdAt: -1 });

    const dtos: ConnectionRequestDTO[] = [];
    for (const r of requests) {
      const userDto = await this.buildNetworkUserDTO(currentId, r.fromUserId);
      if (!userDto) continue;
      dtos.push({
        id: r._id.toString(),
        user: userDto,
        timestamp: r.createdAt.toISOString(),
        message: r.message,
      });
    }

    return dtos;
  }

  // Get all connections for the current user
  static async getConnections(
    currentUserId: string
  ): Promise<{ users: NetworkUserDTO[]; total: number }> {
    const currentId = new Types.ObjectId(currentUserId);

    const connections = await Connection.find({
      $or: [
        { user1Id: currentId },
        { user2Id: currentId },
      ],
    }).sort({ createdAt: -1 });

    // Use a map to avoid duplicates if any
    const usersMap = new Map<string, NetworkUserDTO>();

    for (const conn of connections) {
      const otherUserId = conn.user1Id.equals(currentId)
        ? conn.user2Id
        : conn.user1Id;

      const dto = await this.buildNetworkUserDTO(currentId, otherUserId);
      if (dto) {
        usersMap.set(dto.id, dto);
      }
    }

    const users = Array.from(usersMap.values());
    return { users, total: users.length };
  }

  // Get followers of the current user
  static async getFollowers(
    currentUserId: string
  ): Promise<{ users: NetworkUserDTO[]; total: number }> {
    const currentId = new Types.ObjectId(currentUserId);

    const followers = await Follow.find({
      followingId: currentId,
    }).sort({ createdAt: -1 });

    const dtos: NetworkUserDTO[] = [];
    for (const f of followers) {
      const dto = await this.buildNetworkUserDTO(currentId, f.followerId);
      if (dto) {
        dtos.push(dto);
      }
    }

    return { users: dtos, total: dtos.length };
  }

  // Get users the current user is following
  static async getFollowing(
    currentUserId: string
  ): Promise<{ users: NetworkUserDTO[]; total: number }> {
    const currentId = new Types.ObjectId(currentUserId);

    const following = await Follow.find({
      followerId: currentId,
    }).sort({ createdAt: -1 });

    const dtos: NetworkUserDTO[] = [];
    for (const f of following) {
      const dto = await this.buildNetworkUserDTO(currentId, f.followingId);
      if (dto) {
        dtos.push(dto);
      }
    }

    return { users: dtos, total: dtos.length };
  }

  static async followUser(
    currentUserId: string,
    targetUserId: string
  ): Promise<{ success: boolean; message: string }> {
    const followerId = new Types.ObjectId(currentUserId);
    const followingId = new Types.ObjectId(targetUserId);

    if (followerId.equals(followingId)) {
      throw new Error("Cannot follow yourself");
    }

    await Follow.updateOne(
      { followerId, followingId },
      { $setOnInsert: { followerId, followingId, createdAt: new Date() } },
      { upsert: true }
    );

    return { success: true, message: "User followed successfully" };
  }

  static async unfollowUser(
    currentUserId: string,
    targetUserId: string
  ): Promise<{ success: boolean; message: string }> {
    const followerId = new Types.ObjectId(currentUserId);
    const followingId = new Types.ObjectId(targetUserId);

    await Follow.deleteOne({ followerId, followingId });
    return { success: true, message: "User unfollowed successfully" };
  }

  static async blockUser(
    currentUserId: string,
    targetUserId: string
  ): Promise<{ success: boolean; message: string }> {
    const userId = new Types.ObjectId(currentUserId);
    const blockedUserId = new Types.ObjectId(targetUserId);

    await Block.updateOne(
      { userId, blockedUserId },
      { $setOnInsert: { userId, blockedUserId, createdAt: new Date() } },
      { upsert: true }
    );

    // Remove any existing connections & follows
    await Connection.deleteMany({
      $or: [
        { user1Id: userId, user2Id: blockedUserId },
        { user1Id: blockedUserId, user2Id: userId },
      ],
    });
    await Follow.deleteMany({
      $or: [
        { followerId: userId, followingId: blockedUserId },
        { followerId: blockedUserId, followingId: userId },
      ],
    });

    return { success: true, message: "User blocked successfully" };
  }

  static async unblockUser(
    currentUserId: string,
    targetUserId: string
  ): Promise<{ success: boolean; message: string }> {
    const userId = new Types.ObjectId(currentUserId);
    const blockedUserId = new Types.ObjectId(targetUserId);

    await Block.deleteOne({ userId, blockedUserId });
    return { success: true, message: "User unblocked successfully" };
  }

  static async getNetworkStats(currentUserId: string): Promise<NetworkStatsDTO> {
    const currentId = new Types.ObjectId(currentUserId);

    const [connectionsCount, followersCount, followingCount, pendingRequestsCount] =
      await Promise.all([
        Connection.countDocuments({
          $or: [
            { user1Id: currentId },
            { user2Id: currentId },
          ],
        }),
        Follow.countDocuments({ followingId: currentId }),
        Follow.countDocuments({ followerId: currentId }),
        ConnectionRequest.countDocuments({
          toUserId: currentId,
          status: "pending",
        }),
      ]);

    return {
      connectionsCount,
      followersCount,
      followingCount,
      pendingRequestsCount,
    };
  }
}
