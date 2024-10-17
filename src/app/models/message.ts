export interface IChat {
    _id?: string;
    participants: string[];
    messages: IMessage[];
}

export interface IMessage {
    _id?: string;
    senderUserId: string;
    dateTime: Date;
    text: string;
}