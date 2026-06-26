import { api } from "./client";
import type { BookingResponse } from "./bookings";

export interface PopularHotelItem {
  hotel_id: number;
  name: string;
  bookings_count: number;
  rating: number;
}

export interface AdminDashboard {
  users_count: number;
  hotels_count: number;
  rooms_count: number;
  bookings_count: number;
  popular_hotels: PopularHotelItem[];
  average_rating: number;
  total_revenue: number;
}

export interface ReceptionDashboard {
  total_rooms: number;
  free_rooms: number;
  occupied_rooms: number;
  bookings_count: number;
  guests_count: number;
  average_rating: number;
  recent_bookings: BookingResponse[];
}

export interface ReceptionFinance {
  revenue_today: number;
  revenue_week: number;
  revenue_month: number;
  bookings_count: number;
  deposits_total: number;
}

export async function getAdminDashboard(): Promise<AdminDashboard> {
  const { data } = await api.get<AdminDashboard>("/admin/dashboard");
  return data;
}

export async function getReceptionDashboard(
  hotelId: number,
  targetDate: string,
): Promise<ReceptionDashboard> {
  const { data } = await api.get<ReceptionDashboard>(
    `/reception/hotels/${hotelId}/dashboard`,
    { params: { target_date: targetDate } },
  );
  return data;
}

export async function getReceptionFinance(hotelId: number): Promise<ReceptionFinance> {
  const { data } = await api.get<ReceptionFinance>(`/reception/hotels/${hotelId}/finance`);
  return data;
}
