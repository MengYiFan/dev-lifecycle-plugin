import * as vscode from 'vscode';
import { SimpleGit, simpleGit } from 'simple-git';

export class GitService {
  private git: SimpleGit;
  private rootPath: string;

  constructor(rootPath: string) {
    this.rootPath = rootPath;
    this.git = simpleGit(rootPath);
  }

  async getCurrentBranch(): Promise<string> {
    const status = await this.git.status();
    return status.current || '';
  }

  async isClean(): Promise<boolean> {
    const status = await this.git.status();
    return status.isClean();
  }

  async createBranch(branchName: string, baseBranch: string): Promise<void> {
    await this.git.checkout(baseBranch);
    await this.git.pull();
    await this.git.checkoutLocalBranch(branchName);
  }

  async commit(message: string): Promise<void> {
    await this.git.add('.');
    await this.git.commit(message);
    // Attempt push, handle error if no upstream
    try {
      await this.git.push();
    } catch (e) {
      const current = await this.getCurrentBranch();
      await this.git.push(['-u', 'origin', current]);
    }
  }

  async tag(tagName: string): Promise<void> {
    await this.git.addTag(tagName);
    await this.git.pushTags();
  }
}
