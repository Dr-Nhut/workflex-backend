const conn = require('../config/db.config');
const crypto = require('crypto');
require("dotenv").config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
let endpointSecret;
endpointSecret = "whsec_c7670f38eede9227d4a301a9ece0eb2970122f31fe249d3345ced03c5d377e91";

class StripeController {
    getCheckoutSession(req, res, next) {
        const id = req.params.jobId;
        const sql = `SELECT job.id, job.name, job.description, user.fullname, user.email, offer.price, contract.id as contractId FROM job LEFT JOIN offer ON job.id=offer.jobId LEFT JOIN user ON job.employerId=user.id LEFT JOIN contract ON contract.offerId=offer.id WHERE job.id='${id}' AND offer.status="Đang thực hiện";`;
        conn.promise().query(sql)
            .then(async ([rows, fields]) => {
                console.log(rows[0].contractId);
                const customer = await stripe.customers.create({
                    metadata: {
                        contractId: rows[0].contractId,
                    }
                })

                const session = await stripe.checkout.sessions.create({
                    line_items: [
                        {
                            price_data: {
                                currency: 'vnd',
                                product_data: {
                                    name: rows[0].name,
                                },
                                unit_amount: rows[0].price,
                            },
                            quantity: 1,
                        },
                    ],
                    customer: customer.id,
                    mode: 'payment',
                    // customer_email: rows[0].email,
                    client_reference_id: id,
                    success_url: `${process.env.APP_FE_URL}/checkout-success?jobId=${id}`,
                    cancel_url: `${process.env.APP_FE_URL}/employer-job/${id}/payment`,
                });

                res.send({ url: session.url });
            })
            .catch(err => console.log(err))
    }




    webhook(request, response) {
        const sig = request.headers['stripe-signature'];
        let data;
        let eventType;

        if (endpointSecret) {
            let event;
            try {
                event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);

            } catch (err) {
                console.log(err);
                response.status(400).send(`Webhook Error: ${err.message}`);
                return;
            }

            data = event.data.object;
            eventType = event.type;
        }
        else {
            data = request.body.data.object;
            eventType = request.body.type;
        }

        //Handle events
        if (eventType === "checkout.session.completed") {
            stripe.customers.retrieve(data.customer)
                .then(customer => {
                    const contractId = customer.metadata.contractId;
                    const id = crypto.randomUUID();

                    const sql = "INSERT INTO payment (id, contractId, createdAt, total, paymentIntent) VALUES (?,?, ?, ?, ?);";
                    conn.promise().query(sql, [id, contractId, new Date(), data.amount_total, data.payment_intent])
                        .then(response => {
                            return conn.promise().query(`UPDATE job SET status=7 WHERE id='${data.client_reference_id}'`)
                        })
                        .then(response => {
                            console.log('Checkout successful');
                        })
                        .catch(err => console.error(err));

                })
                .catch(err => console.log(err.message));
        }
        response.send().end();
    }
}

module.exports = new StripeController;