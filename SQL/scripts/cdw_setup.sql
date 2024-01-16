create role web_anon nologin;
grant usage on schema public to web_anon;
grant select on public.applications to web_anon;
grant select on public.claims to web_anon;

create role cdw_authenticator noinherit login password 'mysecretpassword';
grant web_anon to cdw_authenticator;

create role cdw_user nologin;
grant cdw_user to cdw_authenticator;

grant usage on schema public to cdw_user;
grant select on public.applications to cdw_user;
grant select on public.claims to cdw_user;