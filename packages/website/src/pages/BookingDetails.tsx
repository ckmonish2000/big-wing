import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getBookingDetials } from '@/services/bookings.service'
import { Ticket } from '@/components/molecules/Booking'
import { ticketMaker, bookingMaker } from '@/lib/utils'
import { BookingResponse } from '@/services/bookings.service'
import { useQuery } from '@tanstack/react-query'
import { buildUrl } from '@/services/client'
import { useAuth } from '@/hooks/use-auth'

function BookingDetails() {
    const { bookingId } = useParams<{ bookingId: string }>()
    const [bookingStatus, setBookingStatus] = useState<string>('')
    const { token } = useAuth()
    const { data: booking, isLoading } = useQuery({
        queryKey: ['booking', bookingId],
        queryFn: () => getBookingDetials({ bookingId: bookingId || '' }).then(bookings => {
            setBookingStatus(bookings?.bookingStatus || '')
            return bookings || null
        }),
        enabled: !!bookingId
    })
    useEffect(() => {
        if (!bookingId) return;
        const url = buildUrl(`/bookings/:bookingId/status-stream`, { bookingId }, { token });
        const eventSource = new EventSource(url, {
            withCredentials: true
        });

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log(data, "data")
            setBookingStatus(data.entity.bookingStatus);
        };

        eventSource.onerror = (error) => {
            console.error('SSE Error:', error);
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, [bookingId, token]);
    if (isLoading) {
        return <div className="container max-w-4xl mx-auto px-4 py-8">Loading...</div>
    }

    if (!booking) {
        return <div className="container max-w-4xl mx-auto px-4 py-8">Booking not found</div>
    }

    return (
        <div className="container max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Booking Details</h1>
            {bookingStatus && (
                <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-blue-700">Status: {bookingStatus}</p>
                </div>
            )}
            <Ticket
                flight={ticketMaker(booking)}
                booking={bookingMaker(booking)}
            />
        </div>
    )
}

export default BookingDetails