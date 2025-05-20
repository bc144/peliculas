import api from "../api";

interface MarkAsFavoriteResponse {
    success: boolean;
    status_code: number;
    status_message: string;
}

export const markAsFavorite = async (
    movieId: number,
    favorite: boolean,
    guestSessionId: string
): Promise<MarkAsFavoriteResponse> => {
    try {
        const body = {
            media_type: "movie",
            media_id: movieId,
            favorite,
        };
        const { data } = await api.post<MarkAsFavoriteResponse>(
            `/account/${guestSessionId}/favorite`,
            body
        );
        return data;
    } catch (error) {
        console.error('Error marking movie as favorite:', error);
        return {
            success: false,
            status_code: 500,
            status_message: 'Failed to mark movie as favorite'
        };
    }
};