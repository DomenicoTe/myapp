FROM debian:bookworm-slim AS base
WORKDIR /app
COPY dist/myapp .
COPY .env .
RUN chmod +x myapp

FROM base AS final
COPY --from=base /app/myapp .
COPY --from=base /app/.env .
ENTRYPOINT ["/app/myapp"]