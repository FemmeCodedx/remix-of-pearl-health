alter table public.subscriptions
  add column if not exists paddle_subscription_id text,
  add column if not exists paddle_customer_id text,
  add column if not exists product_id text,
  add column if not exists price_id text,
  add column if not exists cancel_at_period_end boolean default false,
  add column if not exists environment text not null default 'sandbox';

alter table public.subscriptions drop constraint if exists subscriptions_user_id_key;

create unique index if not exists subscriptions_paddle_sub_id_key
  on public.subscriptions(paddle_subscription_id)
  where paddle_subscription_id is not null;

create index if not exists idx_subscriptions_user_id on public.subscriptions(user_id);

do $$ begin
  if not exists (
    select 1 from pg_policies
    where schemaname='public' and tablename='subscriptions'
      and policyname='Service role can manage subscriptions'
  ) then
    create policy "Service role can manage subscriptions"
      on public.subscriptions for all
      using (auth.role() = 'service_role')
      with check (auth.role() = 'service_role');
  end if;
end $$;