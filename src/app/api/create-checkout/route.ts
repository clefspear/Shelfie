import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '../../../../supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia'
});

export async function POST(request: Request) {
  try {
    const { priceId, userId } = await request.json();
    const supabase = await createClient();

    // Get user email
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Shelfie Premium',
              description: 'Unlimited books and premium features'
            },
            unit_amount: 499, // $4.99
            recurring: {
              interval: 'month'
            }
          },
          quantity: 1
        }
      ],
      success_url: `${process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:3000'}/home?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:3000'}/search`,
      client_reference_id: userId,
      customer_email: user.email,
      metadata: {
        userId
      }
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
