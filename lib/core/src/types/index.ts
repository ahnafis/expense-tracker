export type UniqueId = number;
export type TimeStamp = number;

export type Entity = {
    readonly id: UniqueId;
    readonly created_at: TimeStamp;
};
