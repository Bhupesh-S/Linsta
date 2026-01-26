export interface CreateGroupRequest {
  name: string;
  description?: string;
}

export interface GroupResponse {
  success: boolean;
  message: string;
  data?: {
    _id: string;
    name: string;
    description?: string;
    createdBy: {
      _id: string;
      name: string;
      email: string;
    };
    members: Array<{
      _id: string;
      name: string;
      email: string;
      profilePicture?: string;
    }>;
    createdAt: Date;
    updatedAt: Date;
  };
}

export interface GroupListResponse {
  success: boolean;
  data: Array<{
    _id: string;
    name: string;
    description?: string;
    createdBy: {
      _id: string;
      name: string;
      email: string;
    };
    members: string[]; // User IDs
    createdAt: Date;
    updatedAt: Date;
  }>;
  pagination: {
    total: number;
    limit: number;
    skip: number;
    hasMore: boolean;
  };
}

export interface SendMessageRequest {
  message: string;
}

export interface GroupMessageResponse {
  success: boolean;
  message: string;
  data?: {
    _id: string;
    groupId: string;
    senderId: {
      _id: string;
      name: string;
      profilePicture?: string;
    };
    message: string;
    createdAt: Date;
  };
}

export interface GroupMessagesListResponse {
  success: boolean;
  data: Array<{
    _id: string;
    groupId: string;
    senderId: {
      _id: string;
      name: string;
      profilePicture?: string;
      email: string;
    };
    message: string;
    createdAt: Date;
  }>;
  pagination: {
    total: number;
    limit: number;
    skip: number;
    hasMore: boolean;
  };
}
