-- Seed regions from regional-catalogue.json (Region Rules sheet)

insert into public.regions (
  id, label, default_price_display, can_change_region, mismatch_rule, checkout_rule, website_message, sort_order
) values
  ('global', 'Global / Unknown', 'Global USD', true, 'Use Global price unless validated otherwise', 'USD checkout', 'Your price is shown in Global USD.', 0),
  ('europe', 'Europe', 'Europe EUR', true, 'Switch to billing-country region or review', 'USD equivalent checkout', 'Europe price shown. Taxes/vat may apply depending billing country.', 1),
  ('uk', 'UK', 'UK GBP', true, 'Switch to billing-country region or review', 'USD equivalent checkout', 'UK price shown. Taxes may apply depending billing country.', 2),
  ('gcc', 'GCC', 'GCC currency by country: AED/SAR/QAR/BHD/KWD/OMR', true, 'South Asia selection requires verification; otherwise switch back to GCC', 'USD equivalent checkout', 'GCC regional price is based on residence and billing country.', 3),
  ('india', 'India', 'India Regional Scholarship', true, 'If billing country is not India, switch to correct region or review', 'USD equivalent checkout', 'India Regional Scholarship Pricing applies only to learners residing and billing from India.', 4),
  ('pakistan', 'Pakistan', 'Pakistan Regional Scholarship', true, 'If billing country is not Pakistan, switch to correct region or review', 'USD equivalent checkout', 'Pakistan Regional Scholarship Pricing applies only to learners residing and billing from Pakistan.', 5)
on conflict (id) do update set
  label = excluded.label,
  default_price_display = excluded.default_price_display,
  can_change_region = excluded.can_change_region,
  mismatch_rule = excluded.mismatch_rule,
  checkout_rule = excluded.checkout_rule,
  website_message = excluded.website_message,
  sort_order = excluded.sort_order;
