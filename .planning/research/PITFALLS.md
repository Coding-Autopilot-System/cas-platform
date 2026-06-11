# Pitfalls Research

| Pitfall | Prevention |
|---|---|
| Treating managed identity as automatically least privilege | Keep role assignments absent until dependencies and scopes are explicit |
| Claiming private security while public endpoints remain | Document v0.1 exposure honestly and make ingress opt-in |
| Using validation scripts that can deploy | Keep what-if isolated and contract-test the absence of create commands |
| Duplicating environments | Use one module graph with reviewed parameter variation |
| Ignoring replacement risk | Require what-if review and additive migrations |
| Hiding cost ownership | Apply mandatory owner/cost tags and optional budgets |

