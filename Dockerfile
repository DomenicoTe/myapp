FROM debian:bookworm-slim AS base
WORKDIR /app
COPY dist/myapp .
RUN chmod +x myapp

FROM base AS final
COPY --from=base /app/myapp .
ENTRYPOINT ["/app/myapp"]