# Publish to GitHub later

This project is a separate local Git repository. No remote has been configured.

Review the files, add your name and experiment evidence, choose a license, then run npm test and npm run demo. Keep qa/ and results/local/ excluded.

Create an empty GitHub repository named prompt-engineering-portfolio-lab. Do not initialize the remote with a README. From this project folder:

~~~sh
git status
git add .
git commit -m "Add prompt engineering portfolio lab"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/prompt-engineering-portfolio-lab.git
git push -u origin main
~~~

Skip the initial commit if one already exists. Configure your author identity if Git requests it. Authenticate through your usual GitHub flow; never place a token in a source file or remote URL.

Update the README clone URL after creating the repository.

Suggested description: Practical prompt engineering handbook and reproducible support-ticket evaluation lab with labeled cases, JSON validation, CLI reports and CI.

Suggested topics: prompt-engineering, llm-evaluation, portfolio-project, nodejs, technical-writing.

A future push can be performed when you supply the destination repository and authorize publishing. Review included files before making them public.
