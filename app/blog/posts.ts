export type InlineSegment = string | { text: string; href: string };

export type Paragraph = string | InlineSegment[];

export interface BlogSection {
  heading?: string;
  paragraphs: Paragraph[];
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  sections: BlogSection[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "zcash-names-tee",
    title: "A fantastic TEE use case: Zcash Names.",
    excerpt:
      "For the past eight weeks, Circuit Labs has been co-developing the Zcash Names protocol. Here is what we learned, and why the protocol leads so naturally to the use of a TEE.",
    sections: [
      {
        paragraphs: [
          "For the past eight weeks, Circuit Labs has been co-developing the Zcash Names protocol. I want to share some of what we learned while refining the design and working through the engineering challenges. One of the most interesting parts is how naturally the protocol leads to the use of a TEE.",
        ],
      },
      {
        heading: "Why Zcash Names ended up inside a TEE",
        paragraphs: [
          "One of the things I love most about Zcash Names is that the architecture is almost forced on you by the privacy model.",
          "In a normal public blockchain naming system, everyone can see the state. If a name points to an address, that mapping is just there, publicly available to everyone.",
          "Zcash is different. Shielded transactions are private by design. If I send something to you, the information is visible to the parties who have the right (viewing) keys to see it. That is great for privacy, but it creates a very specific problem for public names.",
          "If we want one service to understand all registered names, it needs a way to see all of those relevant shielded notes. The obvious way to do that is with one single viewing key, given to all exchanges, wallets, and explorers. Simple and elegant.",
          "And that immediately creates a centralization point.",
          "We managed to unify the names and addresses into a public view. But one viewing key is coupled to one spending key. There is now one entity that can approve state changes and authorize name claims and updates. In our case, that entity is the Mint.",
          "This is exactly where TEEs — Trusted Execution Environments — come in beautifully.",
          "The problem is that centralized infrastructure is controlled by some operator. In ZNS that infrastructure contains a protocol component with privileged authority. Once that component exists, the question becomes: how do we make sure nobody operating the machine can quietly take advantage of that privilege?",
          "Our answer is to run the Mint inside an AMD SEV-SNP confidential VM launched on a Scaleway Elastic Metal bare-metal server.",
          "The operator can start the VM, or guest, stop it, kill it, deny it network access, or delete its disks. What the operator should not be able to do is: read the VM memory from the host, extract the seed from the sealed capsule, or boot a different image and still open that capsule. In production, we also remove ordinary SSH and operator shell access from the guest.",
          "While the operator retains availability control, it does not get unrestricted custody control.",
          "And this is one of the most intuitive use cases of TEEs I have seen in the blockchain space.",
        ],
      },
      {
        heading: "The security boundary: the guest (confidential VM)",
        paragraphs: [
          "The guest image contains the components that comprise the core protocol: Zebra the Zcash node, the Mint, the key generation code, the migration code, and the small amount of infrastructure needed to keep them all alive.",
          "We build a fixed guest image and compute its SEV-SNP measurement. That measurement commits to the launch configuration: the guest firmware, kernel, initial RAM disk, command line, CPU configuration and other measured inputs.",
          "The key idea here is that the seed is not simply “stored on a server.” It is sealed in a capsule to an approved guest context. If one of the measured launch inputs changes, the measurement changes.",
          "If the measurement changes, the new release simply cannot decrypt the original encrypted capsule. The capsule sealing key is derived from the AMD platform’s SEV-SNP key hierarchy and bound to the guest measurement and policy. The measurement and the guest policy are mixed into the derivation.",
          "That is the part I find simple yet sophisticated. The key is tied to the code environment that is allowed to use it.",
          "GitHub releases are therefore part of the security model as well. The release artifacts, expected measurement and upgrade data are published and can be checked independently.",
        ],
      },
      {
        heading: "Inside the guest",
        paragraphs: [
          "The guest is intentionally quite boring (thank God).",
          "There is a small init script that mounts the two persistent volumes, configures networking, starts a supervisor, waits until Zebra is ready, and then allows the key generation ceremony to proceed. Once Zebra is ready and the ceremony is complete, the Mint can run.",
          "Overall there are only a few moving parts, and they all have very explicit open-source dependencies.",
        ],
      },
      {
        heading: "Upgrades and recovery",
        paragraphs: [
          "Sealing a seed into one VM is the first step, but real software evolves.",
          "The protocol improves continuously. The Mint needs to be upgraded. Zebra developers ship quickly. The Linux image changes. Security fixes happen. Eventually hardware changes too.",
          "The moment the measured image changes, the new guest cannot open the previous capsule.",
          "So we needed a way to move custody from one approved VM measurement to another without ever exposing the seed to the host.",
          "The new VM creates an ephemeral migration key and proves, through SEV-SNP attestation, which measurement it is running.",
          "The old guest verifies that attestation and checks that the new measurement is an approved migration target. Only then does the old guest unseal the seed.",
          "It derives a shared secret with the new guest, encrypts the seed for that specific target, and sends only the encrypted transfer through the host-controlled migration channel.",
          "The new guest verifies the source attestation, decrypts the seed, and immediately reseals it with a sealing key derived for its own SEV-SNP platform and guest context.",
          "Then it reopens the new capsule and verifies that the migrated seed is correct before producing a receipt.",
          "So the host coordinates the migration without ever being trusted with the plaintext seed.",
          "The same mechanism also means that, conceptually, a software upgrade and a hardware move are not completely different operations. They are both custody transitions from one attested environment to another.",
          "For disaster recovery, we plan to keep a second SEV-SNP machine in standby, holding its own independently sealed capsule produced by a completed migration of an approved release. While at least one guest capable of opening its capsule is still running, we can migrate onward to a new release or to another SEV-SNP machine. We are also working toward binding each Mint-produced transaction to attestation evidence, so observers can verify which approved guest measurement produced it.",
        ],
      },
      {
        heading: "What the team can and cannot do",
        paragraphs: [
          "Another thing we wanted to make very explicit is the boundary between the operator and the VM.",
          "The host remains ours operationally.",
          "We can kill the VM. We can pause it. We can refuse to restart it. We can block its network. We can destroy the disks.",
          "ZNS users will have to trust us to keep the service available (and the seed capsule safe).",
          "What we are trying to remove is a different kind of trust: the idea that one of us could simply SSH into the mint server, inspect the key, alter the process, or run arbitrary commands next to the custody material.",
          "The production goal is therefore no SSH and no ordinary operator shell inside the guest.",
          "The host should control lifecycle, not guest internals.",
          "TEEs obviously do not remove trust completely. They shift the trust boundary.",
          "And if you define that boundary carefully, they can remove exactly the kind of trust that is most dangerous for custody.",
        ],
      },
      {
        heading: "Does this decentralize the mint?",
        paragraphs: [
          "The short answer is no.",
          "The team still operates the machine. We can still cause downtime. We still control deployment infrastructure today. The TEE doesn’t magically make the system decentralized.",
          "What it does is much more specific, and in my opinion much more meaningful: using hardware, it constrains what the infrastructure operator is allowed to do to the guest.",
          "That is a big improvement over the model where whoever has root on the server effectively owns the application.",
          [
            "There are still steps on the way to becoming ",
            {
              text: "Dev-Proof",
              href: "https://github.com/amiller/devproof-audits-guide#stage-1-checklist",
            },
            ": later we may pin a hash of the guest's attestation in the transactions the mint sends, so the measurement that produced them can be looked up on-chain. The upgrade sequence will soon refuse older releases in order to prevent unauthorized rollbacks. The release itself stays authorized by GitHub, which is the authority we chose to keep.",
          ],
          "But even in the current form, this architecture solves a very real centralization problem created by the neat privacy-first Zcash design. And that is why I like this use of TEEs so much.",
          "It is there because Zcash privacy led to one privileged component, and confidential computing gives us a way to make that component much less dependent on trusting the people running the infrastructure.",
          "That is a genuinely elegant fit.",
        ],
      },
    ],
  },
];

export function getPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
