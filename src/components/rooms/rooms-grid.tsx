import type React from "react";
import { roomsConfig } from "@/config/rooms";
import { RoomCard } from "./room-card";

interface RoomsGridProps {
  gridRef?: React.Ref<HTMLDivElement>;
}

export function RoomsGrid({ gridRef }: RoomsGridProps) {
  const { rooms } = roomsConfig;

  return (
    <div
      ref={gridRef}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8"
    >
      {rooms.map((room, index) => {
        const isThirdOnTablet = index === 2;
        return (
          <RoomCard
            key={room.id}
            room={room}
            className={
              isThirdOnTablet
                ? "md:col-span-2 md:w-[calc(50%-0.75rem)] lg:w-full md:mx-auto lg:col-span-1"
                : ""
            }
          />
        );
      })}
    </div>
  );
}
