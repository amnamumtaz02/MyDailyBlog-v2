pipeline {
    agent any
    triggers { githubPush() }
    stages {
        stage('Clone App Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/amnamumtaz02/MyDailyBlog-v2.git'
            }
        }
        stage('Build and Run App Containers') {
            steps {
                sh 'docker compose -f docker-compose-jenkins.yml down || true'
                sh 'docker compose -f docker-compose-jenkins.yml pull || true'
                sh 'docker compose -f docker-compose-jenkins.yml up -d --build'
                sh 'sleep 30'
                sh 'docker exec blog-app-v2-jenkins npx prisma db push --accept-data-loss'
                sh '''docker exec blog-app-v2-jenkins node -e "const { PrismaClient } = require('@prisma/client'); const bcrypt = require('bcryptjs'); const prisma = new PrismaClient(); bcrypt.hash('Test@1234', 10).then(hash => prisma.user.upsert({ where: { email: 'testuser@example.com' }, update: { password: hash }, create: { name: 'Test User', email: 'testuser@example.com', password: hash } })).then(() => { console.log('SUCCESS: Test user seeded!'); process.exit(0); });"'''
            }
        }
        stage('Run Selenium Tests') {
            steps {
                dir('tests') {
                    git branch: 'main', url: 'https://github.com/amnamumtaz02/MyDailyBlog-Tests.git'
                    sh 'docker build -t mydailyblog-tests .'
                    sh 'docker run --rm --network host mydailyblog-tests'
                }
            }
        }
    }
    post {
        always {
            script {
                def pusherEmail = sh(script: "git log -1 --pretty=format:'%ae'", returnStdout: true).trim()
                emailext(
                    subject: "Test Results: ${currentBuild.result} - Build #${env.BUILD_NUMBER}",
                    body: "<h2>MyDailyBlog CI Results</h2><p>Status: <b>${currentBuild.result}</b></p><p>Build: ${env.BUILD_NUMBER}</p><p>Console: <a href='${env.BUILD_URL}'>${env.BUILD_URL}</a></p>",
                    to: "${pusherEmail}",
                    from: "amna.mumtaz02@gmail.com",
                    mimeType: 'text/html'
                )
            }
        }
    }
}