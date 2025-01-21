import nodemailer from 'nodemailer'
import { Alert } from '@/types/alerts'
import { SearchResults } from '@/types/search'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendAlertEmail(alert: Alert, results: SearchResults) {
  const totalResults = results.reddit.length + results.youtube.length

  if (totalResults === 0) return

  const htmlContent = `
    <h2>New Matching Content Found</h2>
    <p>We found ${totalResults} new items matching your keywords:</p>
    ${alert.keywords.map(k => `<span style="background: #f0f0f0; padding: 2px 6px; border-radius: 4px; margin-right: 4px;">${k}</span>`).join('')}
    
    ${results.reddit.length > 0 ? `
      <h3>Reddit Posts</h3>
      ${results.reddit.map(post => `
        <div style="margin-bottom: 16px;">
          <a href="${post.url}" style="color: #0066cc; text-decoration: none; font-weight: bold;">${post.title}</a>
          <p style="margin: 4px 0; color: #666;">${post.content.slice(0, 200)}...</p>
          <small style="color: #666;">Posted in ${post.subreddit} • ${post.numComments} comments</small>
        </div>
      `).join('')}
    ` : ''}

    ${results.youtube.length > 0 ? `
      <h3>YouTube Videos</h3>
      ${results.youtube.map(video => `
        <div style="margin-bottom: 16px;">
          <a href="${video.url}" style="color: #0066cc; text-decoration: none; font-weight: bold;">${video.title}</a>
          <p style="margin: 4px 0; color: #666;">${video.description.slice(0, 200)}...</p>
          <small style="color: #666;">Posted by ${video.channelTitle}</small>
        </div>
      `).join('')}
    ` : ''}
  `

  try {
    await transporter.sendMail({
      from: 'info@scout-ai.org',
      to: alert.email,
      subject: `Scout AI Alert: ${totalResults} New Matching Items Found`,
      html: htmlContent,
    })
  } catch (error) {
    console.error('Failed to send alert email:', error)
    throw error
  }
}