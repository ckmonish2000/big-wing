import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getBookingDetials } from '@/services/bookings.service'
import { Ticket } from '@/components/molecules/Booking'
import { ticketMaker, bookingMaker } from '@/lib/utils'
import { BookingResponse } from '@/services/bookings.service'
import { useQuery } from '@tanstack/react-query'

function BookingDetails() {
    const { bookingId } = useParams<{ bookingId: string }>()

    const { data: booking, isLoading } = useQuery({
        queryKey: ['booking', bookingId],
        queryFn: () => getBookingDetials({ bookingId: bookingId || '' }).then(bookings => bookings || null),
        enabled: !!bookingId
    })


    if (isLoading) {
        return <div className="container max-w-4xl mx-auto px-4 py-8">Loading...</div>
    }

    if (!booking) {
        return <div className="container max-w-4xl mx-auto px-4 py-8">Booking not found</div>
    }

    return (
        <div className="container max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Booking Details</h1>
            <Ticket
                flight={ticketMaker(booking)}
                booking={bookingMaker(booking)}
            />
        </div>
    )
}

export default BookingDetails