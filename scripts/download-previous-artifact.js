import { promises as fs } from 'fs';
import { execSync } from 'child_process';

export default async function deploy({ github, context, core }) {
  const owner = context.repo.owner;
  const repo = context.repo.repo;

  const workflows = await github.rest.actions.listRepoWorkflows({
    owner,
    repo
  });

  const workflow = workflows.data.workflows.find(w => w.path.includes(process.env.WORKFLOW_FILENAME));

  if (!workflow) {
    core.setFailed("No workflow found");
    return;
  }

  const runs = await github.rest.actions.listWorkflowRuns({
    owner,
    repo,
    workflow_id: workflow.id,
    status: "success",
    per_page: 1
  });

  if (runs.data.total_count === 0) {
    core.setFailed("No runs found");
    return;
  }

  const artifacts = await github.rest.actions.listWorkflowRunArtifacts({
    owner,
    repo,
    run_id: runs.data.workflow_runs[0].id
  });

  const artifact = artifacts.data.artifacts.find(artifact => artifact.name === process.env.ARTIFACT_NAME);
  if (artifact) {
    const response = await github.rest.actions.downloadArtifact({
      owner,
      repo,
      artifact_id: artifact.id,
      archive_format: 'zip'
    });
    await fs.writeFile(process.env.ARTIFACT_FILENAME, Buffer.from(response.data));
    execSync(`unzip -o ${process.env.ARTIFACT_FILENAME} -d ${process.env.UNZIP_DIR}`);
    // Remove the test reports here
    console.log("Artifact downloaded successfully");
  } else {
    core.setFailed("No artifact found");
  }
}
