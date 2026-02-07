pipeline {
    agent any

    environment {
        VERCEL_TOKEN = credentials('vercel-token')
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build & Deploy') {
            agent {
                docker {
                    image 'node:20'
                    reuseNode true
                }
            }

            stages {

                stage('Install Dependencies') {
                    steps {
                        sh 'npm install'
                    }
                }

                stage('Build Project') {
                    steps {
                        sh 'npm run build'
                    }
                }

                stage('Deploy to Vercel') {
                    steps {
                        sh 'npm install -g vercel'
                        sh 'vercel --prod --token=$VERCEL_TOKEN --yes'
                    }
                }

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