pipeline {
    agent any

    environment {
        VERCEL_TOKEN = credentials('vercel-token')
    }

    stages {

        stage('Install Dependencies') {
            agent {
                docker {
                    image 'node:20'
                }
            }
            steps {
                sh 'npm install'
            }
        }

        stage('Build Project') {
            agent {
                docker {
                    image 'node:20'
                }
            }
            steps {
                sh 'npm run build'
            }
        }

        stage('Deploy to Vercel') {
            agent {
                docker {
                    image 'node:20'
                }
            }
            steps {
                sh 'npx vercel --prod --token=$VERCEL_TOKEN --yes'
            }
        }
    }

    post {
        success {
            echo '✅ Deployment Successful'
        }
        failure {
            echo '❌ Deployment Failed'
        }
    }
}