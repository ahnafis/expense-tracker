type UniqueId = number;
type TimeStamp = number;

type Entity = {
    readonly id: UniqueId;
    readonly created_at: TimeStamp;
};

export type { Entity, TimeStamp, UniqueId };
