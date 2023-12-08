import { RoundType } from "prisma/@generated"

export class CreateRoundDto {
    match_id: string
    sender_id: string
    receiver_id: string
    content: string
    type: RoundType
}
