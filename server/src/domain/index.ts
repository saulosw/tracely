/*
 * DEPENDENCY RULE — the one constraint that keeps this architecture clean:
 * nothing inside domain/ may import from infra/ or main/. The domain layer
 * holds pure business concepts (entities, repository interfaces, use cases,
 * errors) and knows nothing about Express, databases, GitHub, or any other
 * tool. Dependencies always point inward: infra/ implements the interfaces
 * declared here, and main/ wires the two together. If a domain file needs
 * something external, define an interface for it here and implement it in
 * infra/ — never import the concrete thing directly.
 */
export {}
