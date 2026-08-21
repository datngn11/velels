# VELÉLS — Domain Glossary

Shared language for the VELÉLS storefront. Glossary only — no implementation
details, no specs, no decisions. If it belongs in code or an ADR, it does not
belong here.

## Model

A garment design, identified by name (Azure, Dimaya, Lunar). Referred to in code
as a product. Belongs to exactly one Category.

## Category

The garment family a Model belongs to: **one-piece**, **two-piece**, or
**dress**. Category determines which sizing dimensions apply — most importantly,
only one-pieces have a Ростовка.

## Standard Size

One of XXS, XS, S, M, L, expressed as body measurement ranges (bust, waist,
hips). Dresses start at XS. Ordering to a Standard Size is the normal path; see
Individual Tailoring for the exception.

## Height

The customer's own height in centimetres, stated by her when ordering. It is a
plain number, not a choice from a list.

## Ростовка (Height Variant)

The torso-length grading of a one-piece: 155–165, 165–170, 171–175 cm. It is an
**internal manufacturing concept** — the seamstress derives it from the
customer's Height. The customer never selects a Ростовка and does not need to
know the term.

## Dress Length

The finished length of a dress, 131 cm by default. Because it is fixed rather
than height-scaled, the same dress reads differently on customers of different
heights.

## Individual Tailoring (Индивидуальный пошив)

Cutting a garment to a customer's own measurements instead of to a Standard
Size. It happens occasionally, by arrangement in Direct, for a figure outside
the size grid — carrying a surcharge and full prepayment. It is **not an offering
of the storefront**: the site sells Standard Sizes only, and no part of the site
collects measurements. Recorded here because the term will come up in
conversation, not because it is a path the site supports.

## Sale Price

A reduced price a Model carries while a sale is running, shown beside the original
price struck through. It belongs to the Model, applies to everyone, and has an
active period. Distinct from a discount code, which is per-customer and does not
exist yet.

## Sellable Configuration

The complete specification of what a customer is buying:

- one-piece: Model × Colour × Standard Size × Height
- two-piece: Model × Colour × Standard Size
- dress: Model × Colour × Standard Size

Individual Tailoring replaces the Standard Size component with a set of
measurements. A configuration is not an inventory unit — see Made to Order.

## Made to Order

VELÉLS sews each garment after the Order is placed. Nothing is stocked, so no
Sellable Configuration is ever "out of stock" and restock has no meaning.
Availability is a question of whether orders are being accepted, not of counts.

## Returns Stock

The only physical inventory that exists: garments that came back via an Exchange
or an uncollected COD parcel. Finished goods in a known Sellable Configuration
that can ship immediately rather than being sewn. Incidental and unpredictable —
a couple of items at a time — so it is **never surfaced on the storefront** and
is offered, if at all, in Direct.

## Order Request (Заявка)

What the site's form produces: an expression of interest, **not** a sale. It
carries the Sellable Configuration, the customer's Height, full name, phone, and
her chosen Contact Channel. Optionally her Measurements. It carries **no payment
method and no delivery branch** — those belong to the conversation that follows.
A Consultant contacts her and turns the Request into an Order, or it lapses.

## Request Number

The short identifier shown to the customer the moment she submits an Order
Request. Its job is reconciliation: if she also writes in Direct, the number is
what ties that conversation to the Request already in the system.

## Order

A confirmed sale: an Order Request that a Consultant has spoken to the customer
about and agreed. Only at this point are payment terms, Nova Poshta відділення,
and the production slot settled. Nothing is cut before an Order exists.

## Consultant

The person who receives an Order Request, contacts the customer, advises on size,
agrees payment terms, and confirms the Order. In practice the owner, who takes
~95% of orders. Payment terms are set in conversation, case by case — the site
never states which method a customer must use.

## Contact Channel

Where the customer wants to be contacted about her Order Request: **Telegram** or
**Instagram**, her choice. Her phone number is collected for the delivery
waybill, not as the primary way to reach her.

## Measurements

Bust, waist and hips in centimetres, **optionally** supplied with an Order
Request so the Consultant can sanity-check the chosen Standard Size before
production. Never required — a customer who does not know them still completes
the Request.

## Order Channel

Where an Order originates. Both channels are full purchase paths of equal
standing:

- **Site** — the form on velels.com, producing an Order Request.
- **Direct** — an Instagram Direct conversation, which serves as size
  consultation and checkout at once.

## Exchange

A one-time swap of a delivered garment for a different Standard Size or a
different Model, within 14 calendar days, subject to the item being unused.
Swimwear is otherwise non-returnable under Decree No. 172 (1994) as an underwear
item. An exchanged garment becomes Returns Stock.

## Alteration

Adjusting a delivered garment to fit the customer, rather than replacing it.
Distinct from an Exchange: the customer keeps her garment and VELÉLS modifies it.

## Prepayment

Money taken before dispatch. Forms:

- **Full prepayment** — required for Individual Tailoring and for all
  international orders (goods and shipping both paid in advance).
- **500 UAH partial prepayment** — secures a domestic COD (післяплата) order.
  Non-refundable if the parcel is refused or uncollected.
