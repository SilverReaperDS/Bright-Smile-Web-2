content = r"""$kind: http-request
name: Get Messages
method: GET
url: 'http://localhost:5000/api/messages'
order: 1000
headers:
  - key: Authorization
    value: 'Bearer {{token}}'
scripts:
  - type: afterResponse
    language: text/javascript
    code: |-
      const template = `
      <style>
        body { font-family: Arial, sans-serif; padding: 10px; }
        table { border-collapse: collapse; width: 100%; }
        th { background-color: #2c3e50; color: white; padding: 10px; text-align: left; }
        td { padding: 8px 10px; border-bottom: 1px solid #ddd; }
        tr:nth-child(even) { background-color: #f2f2f2; }
        tr:hover { background-color: #e8f4f8; }
        .badge-read { color: green; font-size: 16px; }
        .badge-unread { color: red; font-size: 16px; }
      </style>
      <h2>📬 Messages</h2>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Message</th>
            <th>Read</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {{#each messages}}
          <tr>
            <td>{{add @index 1}}</td>
            <td>{{name}}</td>
            <td>{{email}}</td>
            <td>{{message}}</td>
            <td class="{{#if read}}badge-read{{else}}badge-unread{{/if}}">{{#if read}}✅{{else}}❌{{/if}}</td>
            <td>{{date createdAt}}</td>
          </tr>
          {{/each}}
        </tbody>
      </table>`;

      const messages = pm.response.json();
      pm.visualizer.set(template, {
        messages: messages,
        add: (a, b) => a + b,
        date: (d) => new Date(d).toLocaleString()
      });
"""

with open(r'postman\collections\Bright-Smile-Messages\get-messages.request.yaml', 'w', encoding='utf-8', newline='\n') as f:
    f.write(content)

print('Done')
