using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using System.Threading.Tasks;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using System.Net.Mail;
using System.Collections.Concurrent;


namespace SendingEmailsWithWebMailInMVC.LCSK
{
    public class ChatHub : Hub
    {
        private const string CONFIG_FILE = "lcsk.dat";

        List<Agent> Agents
        {
            get
            {
                if (HttpContext.Current.Cache["lcsk_agents"] != null)
                    return (List<Agent>)HttpContext.Current.Cache["lcsk_agents"];
                else
                {
                    List<Agent> agents = new List<Agent>();
                    HttpContext.Current.Cache.Add(
                        "lcsk_agents",
                        agents,
                        null,
                        DateTime.Now.AddHours(1),
                        TimeSpan.Zero, System.Web.Caching.CacheItemPriority.Default, null);
                    return agents;
                }
            }
        }

        /*Dictionary<string, string> ChatSessions
        {
            get
            {
                if (HttpContext.Current.Cache["lcsk_sessions"] != null)
                    return (Dictionary<string, string>)HttpContext.Current.Cache["lcsk_sessions"];
                else
                {
                    Dictionary<string, string> sessions = new Dictionary<string, string>();
                    HttpContext.Current.Cache.Add(
                        "lcsk_sessions",
                        sessions,
                        null,
                        DateTime.Now.AddHours(1),
                        TimeSpan.Zero,
                        System.Web.Caching.CacheItemPriority.Default, null);
                    return sessions;
                }
            }
        }*/

        private static ConcurrentDictionary<string, string> ChatSessions;

        public void AgentConnect(string name, string pass)
        {
            if (ChatSessions == null)
                ChatSessions = new ConcurrentDictionary<string, string>();

            string hashPass = ToHash(pass);

            var config = GetConfig();
            if (config == null || config.Length < 2)
            {
                Clients.Caller.loginResult(false, "config", "");
            }
            else if ((config[0] == hashPass) || (config[1] == hashPass))
            {
                var agent = new Agent()
                {
                    Id = Context.ConnectionId,
                    Name = name,
                    IsOnline = true
                };

                Agents.Add(agent);

                Clients.Caller.loginResult(true, agent.Id, agent.Name);

                Clients.All.onlineStatus(Agents.Count(x => x.IsOnline) > 0);
            }
            else
                Clients.Caller.loginResult(false, "pass", "");
        }

        public void ChangeStatus(bool online)
        {
            var agent = Agents.SingleOrDefault(x => x.Id == Context.ConnectionId);
            if (agent != null)
            {
                agent.IsOnline = online;

                // TODO: Check if the agent was in chat sessions.

                Clients.All.onlineStatus(Agents.Count(x => x.IsOnline) > 0);
            }
        }

        public void EngageVisitor(string connectionId)
        {
            var agent = Agents.SingleOrDefault(x => x.Id == Context.ConnectionId);
            if(agent != null)
            {
                ChatSessions.TryAdd(connectionId, agent.Id);

                Clients.Caller.newChat(connectionId);

                Clients.Client(connectionId).setChat(connectionId, agent.Name, false);

                Clients.Caller.addMessage(connectionId, "system", "You invited this visitor to chat...");
                Clients.Client(connectionId).addMessage(agent.Name, "Hey there. I'm " + agent.Name + " let me know if you have any questions.");
            }
        }

        public void LogVisit(string page, string referrer, string existingChatId)
        {
            Clients.Caller.onlineStatus(Agents.Count(x => x.IsOnline) > 0);

            if (!string.IsNullOrEmpty(existingChatId) &&
                ChatSessions.ContainsKey(existingChatId))
            {
                var agentId = ChatSessions[existingChatId];
                Clients.Client(agentId).visitorSwitchPage(existingChatId, Context.ConnectionId, page);

                var agent = Agents.SingleOrDefault(x => x.Id == agentId);

                if (agent != null)
                    Clients.Caller.setChat(Context.ConnectionId, agent.Name, true);

                string buffer = "";
                ChatSessions.TryRemove(existingChatId, out buffer);

                ChatSessions.TryAdd(Context.ConnectionId, agentId);
            }

            foreach (var agent in Agents)
            {
                var chatWith = (from c in ChatSessions
                               join a in Agents on c.Value equals a.Id
                               where c.Key == Context.ConnectionId
                               select a.Name).SingleOrDefault();

                Clients.Client(agent.Id).newVisit(page, referrer, chatWith, Context.ConnectionId);
            }
        }

        public void RequestChat(string message)
        {
            // We assign the chat to the less buzy agent
            var workload = from a in Agents
                           where a.IsOnline
                           select new
                           {
                               Id = a.Id,
                               Name = a.Name,
                               Count = ChatSessions.Count(x => x.Value == a.Id)
                           };

            if (workload == null)
            {
                Clients.Caller.addMessage("", "No agent are currently available.");
                return;
            }

            var lessBuzy = workload.OrderBy(x => x.Count).FirstOrDefault();

            if (lessBuzy == null)
            {
                Clients.Caller.addMessage("", "No agent are currently available.");
                return;
            }
            
            ChatSessions.TryAdd(Context.ConnectionId, lessBuzy.Id);

            Clients.Client(lessBuzy.Id).newChat(Context.ConnectionId);

            Clients.Caller.setChat(Context.ConnectionId, lessBuzy.Name, false);

            Clients.Client(lessBuzy.Id).addMessage(Context.ConnectionId, "visitor", message);
            Clients.Caller.addMessage("me", message);
        }

        public void Send(string data)
        {
            Clients.Caller.addMessage("me", data);

            if (ChatSessions.ContainsKey(Context.ConnectionId))
            {
                var opId = ChatSessions[Context.ConnectionId];
                Clients.Client(opId).addMessage(Context.ConnectionId, "visitor", data);
            }
            else
            {
                // refactor this
                var workload = from a in Agents
                               where a.IsOnline
                               select new
                               {
                                   Id = a.Id,
                                   Name = a.Name,
                                   Count = ChatSessions.Count(x => x.Value == a.Id)
                               };

                if (workload == null)
                {
                    Clients.Caller.addMessage("", "No agent are currently available.");
                    return;
                }

                var lessBuzy = workload.OrderBy(x => x.Count).FirstOrDefault();

                if (lessBuzy == null)
                {
                    Clients.Caller.addMessage("", "No agent are currently available.");
                    return;
                }

                ChatSessions.TryAdd(Context.ConnectionId, lessBuzy.Id);

                Clients.Client(lessBuzy.Id).newChat(Context.ConnectionId);

                Clients.Caller.setChat(Context.ConnectionId, lessBuzy.Name, false);

                Clients.Client(lessBuzy.Id).addMessage(Context.ConnectionId, "system", "This visitor appear to have lost their chat session.");
                Clients.Client(lessBuzy.Id).addMessage(Context.ConnectionId, "visitor", data);
            }
        }

        public void OpSend(string id, string data)
        {
            var agent = Agents.SingleOrDefault(x => x.Id == Context.ConnectionId);
            if (agent == null)
            {
                Clients.Caller.addMessage(id, "system", "We were unable to send your message, please reload the page.");
                return;
            }

            if (id == "internal")
            {
                foreach (var a in Agents.Where(x => x.IsOnline))
                    Clients.Client(a.Id).addMessage(id, agent.Name, data);
                        
            }
            else if (ChatSessions.ContainsKey(id))
            {
                Clients.Caller.addMessage(id, "you", data);
                Clients.Client(id).addMessage(agent.Name, data);
            }
        }

        public void CloseChat(string id)
        {
            if (ChatSessions.ContainsKey(id))
            {
                Clients.Client(id).addMessage("", "The agent close the chat session.");

                string buffer = "";
                ChatSessions.TryRemove(id, out buffer);
            }
        }

        public void LeaveChat(string id)
        {
            // was it an agent
            var agent = Agents.SingleOrDefault(x => x.Id == id);
            if (agent != null)
            {
                Agents.Remove(agent);

                var sessions = ChatSessions.Where(x => x.Value == agent.Id);
                if(sessions != null)
                {
                    foreach(var session in sessions)
                        Clients.Client(session.Key).addMessage("", "The agent was disconnected from chat.");
                }

                Clients.All.updateStatus(Agents.Count(x => x.IsOnline) > 0);
            }

            // was it a visitor
            if (ChatSessions.ContainsKey(id))
            {
                var agentId = ChatSessions[id];
                Clients.Client(agentId).addMessage(id, "system", "The visitor close the connection.");
            }
        }

        public override Task OnDisconnected()
        {
            return Clients.All.leave(Context.ConnectionId);
        }

        public void SendEmail(string from, string message)
        {
            var msg = new MailMessage();
            msg.To.Add(new MailAddress(from));
            msg.Subject = "LCSK - Offline Contact";
            msg.Body = "You received an offline contact from your LCSK chat widget.\r\n\r\n" + message;

            using (var client = new SmtpClient())
            {
                client.Send(msg);
            }
        }

        #region Install and config methods
        public void getInstallState()
        {
            var config = GetConfig();

            if (config != null && config.Length >= 2)
                Clients.Caller.installState(true, config[0]);
            else
                Clients.Caller.installState(false, "lcskv2hctemptoken");
        }

        public void AdminRequest(string pass)
        {
            var config = GetConfig();

            if (config != null && config.Length >= 2)
            {
                if (config[0] == ToHash(pass))
                    Clients.Caller.adminResult(true, config[0]);
                else
                    Clients.Caller.adminResult(false, "");
            }
            else
                Clients.Caller.adminResult(false, "");
        }

        public void SetConfig(string token, string adminPass, string agentPass)
        {
            bool shouldSave = false;
            var config = GetConfig();

            if (config != null && config.Length >= 2)
            {
                if (config[0] == token)
                    shouldSave = true;
            }
            if (token == "lcskv2hctemptoken")
                shouldSave = true;

            if (shouldSave)
            {
                string configPath = HttpContext.Current.Server.MapPath("~/App_Data/" + CONFIG_FILE);

                File.WriteAllText(
                    configPath,
                    ToHash(adminPass) + "\n" + ToHash(agentPass));

                Clients.Caller.setConfigResult(true, "Config file updated.");
            }
            else
                Clients.Caller.setConfigResult(false, "Unable to save the config file.");
        }

        private string[] GetConfig()
        {
            string configPath = HttpContext.Current.Server.MapPath("~/App_Data/" + CONFIG_FILE);
            if (File.Exists(configPath))
            {
                return File.ReadAllLines(configPath);
            }
            return null;
        }

        public string ToHash(string password)
        {
            if (string.IsNullOrEmpty(password))
                return "";

            var provider = new SHA1CryptoServiceProvider();
            var encoding = new UnicodeEncoding();
            return Convert.ToBase64String(provider.ComputeHash(encoding.GetBytes(password)));
        }
        #endregion
    }
}