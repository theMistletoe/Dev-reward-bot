import { Probot } from "probot";

export = (app: Probot) => {
  app.on([
    "pull_request.opened",
    "pull_request.edited",
    "pull_request.reopened",
    "pull_request.synchronize",
    "pull_request.merged",
    "pull_request.closed",
  ],
  async (context) => {
    const { body, user, base } = context.payload.pull_request

    const grepTargetAddress = body.match(/TargetAddress:(.*)/)
    const grepDevAmount = body.match(/DevAmount:(.*)/)

    if (grepTargetAddress && grepDevAmount) {
      const result = context.octokit.issues.createComment(context.issue(
        {
          body: `@${user.login} Thank you for your contribution!
          @${base.repo.owner.login} If you agree with reward amount, send Dev token through this link.
          https://dev-transfer.vercel.app/?targetAddress=${grepTargetAddress[1].trim()}&transferAmount=${grepDevAmount[1].trim()}`
        }
      ));
      return result
    } else {
      const result = context.octokit.issues.createComment(context.issue(
        {
          body: `@${user.login} Thank you for your contribution!
          This repository is on Dev Challenge.
          For your contribution, you can claim  Dev token rewards.
          Update you top comment including like below example!

          TargetAddress:[your wallet address(0x~~)]
          DevAmount:[amount]`
        }
      ));
      return result
    }
  });
  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
};
