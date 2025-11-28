import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, AlertTriangle, Award, Sparkles } from "lucide-react";
import Header from "@/components/Header";

export default function ExcellenceGuide() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Header />

      <div className="container py-12 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 px-4 py-2 rounded-full mb-4">
            <Award className="w-5 h-5" />
            <span className="font-semibold">Cinematic Excellence Standards</span>
          </div>
          <h1 className="text-5xl font-bold mb-4">
            Excellence Guide
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Master the 6 mandatory criteria to achieve <strong>9-10/10 Gold scores</strong> with our ultra-demanding evaluation system. Based on Oscar-winning cinematography standards.
          </p>
        </div>

        {/* Score Tiers */}
        <Card className="p-8 mb-12 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-400" />
            Evaluation Tiers
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-amber-500">10/10</Badge>
                <span className="font-semibold">PERFECTION</span>
              </div>
              <p className="text-sm text-white/80">Worthy of Cannes Film Festival - Zero improvements possible</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-amber-600">9/10</Badge>
                <span className="font-semibold">CINEMATIC EXCELLENCE</span>
              </div>
              <p className="text-sm text-white/80">Hollywood/Pixar production quality</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-slate-400">8/10</Badge>
                <span className="font-semibold">PROFESSIONAL MASTERY</span>
              </div>
              <p className="text-sm text-white/80">Premium production ready for broadcast</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-slate-500">7/10</Badge>
                <span className="font-semibold">SOLID PROFESSIONAL</span>
              </div>
              <p className="text-sm text-white/80">Minor optimizations needed</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-orange-600">5-6/10</Badge>
                <span className="font-semibold">ACCEPTABLE</span>
              </div>
              <p className="text-sm text-white/80">Multiple improvements required</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-red-600">&lt;5/10</Badge>
                <span className="font-semibold">UNACCEPTABLE</span>
              </div>
              <p className="text-sm text-white/80">Major reconstruction needed</p>
            </div>
          </div>
        </Card>

        {/* 6 Mandatory Criteria */}
        <div className="space-y-8 mb-12">
          <h2 className="text-3xl font-bold text-center">6 Mandatory Criteria for Gold (9-10/10)</h2>
          <p className="text-center text-muted-foreground mb-8">
            ALL criteria must be met to achieve excellence. Missing even one results in automatic downgrade.
          </p>

          {/* Criterion 1 */}
          <Card className="p-8">
            <div className="flex items-start gap-4">
              <div className="bg-amber-100 text-amber-900 rounded-full p-3">
                <span className="text-2xl font-bold">1</span>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-3">Cinematic Mastery in Camera Work</h3>
                <p className="text-muted-foreground mb-4">
                  Precise technical specifications for camera equipment, lenses, and movement.
                </p>
                
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2 text-green-900">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="font-semibold">EXCELLENT</span>
                    </div>
                    <code className="text-sm text-green-800">
                      "ARRI Alexa Mini LF + Zeiss Supreme Prime 50mm T1.5, handheld Ronin 2 gimbal, 0.5m/s dolly-in with smooth deceleration"
                    </code>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2 text-red-900">
                      <XCircle className="w-5 h-5" />
                      <span className="font-semibold">POOR (-3 pts)</span>
                    </div>
                    <code className="text-sm text-red-800">
                      "Professional camera with good lens, smooth movement"
                    </code>
                  </div>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                  <p className="text-sm font-semibold text-blue-900 mb-2">REQUIREMENTS:</p>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>✓ Exact camera model (e.g., ARRI Alexa, RED Komodo)</li>
                    <li>✓ Specific lens with aperture (e.g., Zeiss 50mm T1.5)</li>
                    <li>✓ Movement technique + speed (e.g., gimbal 0.5m/s)</li>
                    <li>✓ Stabilization method (e.g., Ronin 2, DJI RS3)</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>

          {/* Criterion 2 */}
          <Card className="p-8">
            <div className="flex items-start gap-4">
              <div className="bg-amber-100 text-amber-900 rounded-full p-3">
                <span className="text-2xl font-bold">2</span>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-3">Precise Timing (Down to the Second)</h3>
                <p className="text-muted-foreground mb-4">
                  Every action, movement, and transition must have exact timing in seconds.
                </p>
                
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2 text-green-900">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="font-semibold">EXCELLENT</span>
                    </div>
                    <code className="text-sm text-green-800">
                      "0-3s: Close-up of coffee beans pouring<br/>
                      3-8s: Steam rising with focus pull<br/>
                      8-14s: Hand wrapping around warm cup<br/>
                      14-20s: First sip with eyes closing"
                    </code>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2 text-red-900">
                      <XCircle className="w-5 h-5" />
                      <span className="font-semibold">POOR (-2 pts)</span>
                    </div>
                    <code className="text-sm text-red-800">
                      "First sequence: Product showcase<br/>
                      Second sequence: Features display<br/>
                      Third sequence: Final reveal"
                    </code>
                  </div>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                  <p className="text-sm font-semibold text-blue-900 mb-2">REQUIREMENTS:</p>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>✓ Exact timing for each sequence (e.g., "0-3s:", "3-8s:")</li>
                    <li>✓ Camera movement duration specified</li>
                    <li>✓ Audio sync points with timestamps</li>
                    <li>✓ NO generic labels like "Sequence 1/2/3"</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>

          {/* Criterion 3 */}
          <Card className="p-8">
            <div className="flex items-start gap-4">
              <div className="bg-amber-100 text-amber-900 rounded-full p-3">
                <span className="text-2xl font-bold">3</span>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-3">Clear Emotional Storytelling Arc</h3>
                <p className="text-muted-foreground mb-4">
                  Three-act structure with intentional emotional progression.
                </p>
                
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6 mb-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <div className="font-bold text-purple-900 mb-2">ACT 1: INTRIGUE</div>
                      <p className="text-sm text-purple-800">Establish mystery, desire, or curiosity</p>
                    </div>
                    <div>
                      <div className="font-bold text-purple-900 mb-2">ACT 2: CONNECTION</div>
                      <p className="text-sm text-purple-800">Build emotional engagement and intimacy</p>
                    </div>
                    <div>
                      <div className="font-bold text-purple-900 mb-2">ACT 3: IMPACT</div>
                      <p className="text-sm text-purple-800">Deliver memorable climax and satisfaction</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                  <p className="text-sm font-semibold text-blue-900 mb-2">REQUIREMENTS:</p>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>✓ Clear emotional journey across 3 sequences</li>
                    <li>✓ Intentional progression (not random scenes)</li>
                    <li>✓ Climax in final sequence</li>
                    <li>✓ Coherent narrative thread</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>

          {/* Criterion 4 */}
          <Card className="p-8">
            <div className="flex items-start gap-4">
              <div className="bg-amber-100 text-amber-900 rounded-full p-3">
                <span className="text-2xl font-bold">4</span>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-3">Complete Technical Specifications</h3>
                <p className="text-muted-foreground mb-4">
                  All technical parameters must be fully specified.
                </p>
                
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2 text-green-900">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="font-semibold">COMPLETE</span>
                    </div>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>• Resolution: 4K UHD (3840×2160)</li>
                      <li>• Frame Rate: 24fps (cinematic)</li>
                      <li>• Color Space: Rec. 2020</li>
                      <li>• Bit Depth: 10-bit</li>
                      <li>• Codec: ProRes 422 HQ</li>
                      <li>• Duration: Exactly 20 seconds</li>
                    </ul>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2 text-red-900">
                      <XCircle className="w-5 h-5" />
                      <span className="font-semibold">INCOMPLETE (-3 pts)</span>
                    </div>
                    <ul className="text-sm text-red-800 space-y-1">
                      <li>• Resolution: 4K</li>
                      <li>• Frame Rate: Standard</li>
                      <li>• Color: Professional</li>
                      <li>• Quality: High</li>
                      <li>• Duration: 20 seconds</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Criterion 5 */}
          <Card className="p-8">
            <div className="flex items-start gap-4">
              <div className="bg-amber-100 text-amber-900 rounded-full p-3">
                <span className="text-2xl font-bold">5</span>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-3">Creative Originality (No Generic Language)</h3>
                <p className="text-muted-foreground mb-4">
                  Eliminate all clichés and generic terminology.
                </p>
                
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-3 text-red-900">
                    <AlertTriangle className="w-5 h-5" />
                    <span className="font-semibold">FORBIDDEN TERMS (Automatic -3 to -5 pts)</span>
                  </div>
                  <div className="grid md:grid-cols-3 gap-2 text-sm">
                    <code className="bg-red-100 text-red-900 px-2 py-1 rounded">showcase</code>
                    <code className="bg-red-100 text-red-900 px-2 py-1 rounded">display</code>
                    <code className="bg-red-100 text-red-900 px-2 py-1 rounded">demonstrate</code>
                    <code className="bg-red-100 text-red-900 px-2 py-1 rounded">Sequence 1/2/3</code>
                    <code className="bg-red-100 text-red-900 px-2 py-1 rounded">good lighting</code>
                    <code className="bg-red-100 text-red-900 px-2 py-1 rounded">nice camera</code>
                  </div>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                  <p className="text-sm font-semibold text-blue-900 mb-2">INSTEAD, USE:</p>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>✓ Specific actions: "pour", "grip", "rotate", "reveal"</li>
                    <li>✓ Descriptive beats: "Tension builds", "Moment of discovery"</li>
                    <li>✓ Sensory details: "Steam curls upward", "Leather creaks"</li>
                    <li>✓ Emotional states: "Anticipation", "Satisfaction", "Wonder"</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>

          {/* Criterion 6 */}
          <Card className="p-8">
            <div className="flex items-start gap-4">
              <div className="bg-amber-100 text-amber-900 rounded-full p-3">
                <span className="text-2xl font-bold">6</span>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-3">Professional Audio Design</h3>
                <p className="text-muted-foreground mb-4">
                  Layered soundscape with precise sync points and technical specifications.
                </p>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2 text-green-900">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-semibold">PROFESSIONAL AUDIO DESIGN</span>
                  </div>
                  <div className="text-sm text-green-800 space-y-2">
                    <p><strong>Ambient Layer:</strong> Soft cafe ambience 20dB, espresso machine hiss 35dB</p>
                    <p><strong>Foley:</strong> Ceramic clink at 3s, steam hiss crescendo 5-8s, fabric rustle sync with hand at 10s</p>
                    <p><strong>Music:</strong> Minimal piano enters at 8s, warm crescendo 14-18s, gentle resolution 18-20s</p>
                    <p><strong>Sync Points:</strong> Music swell syncs with first sip at 15s</p>
                  </div>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                  <p className="text-sm font-semibold text-blue-900 mb-2">REQUIREMENTS:</p>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>✓ Multiple audio layers (ambient + foley + music)</li>
                    <li>✓ Decibel levels specified</li>
                    <li>✓ Exact sync points with timestamps</li>
                    <li>✓ Music cues with timing</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Automatic Penalties */}
        <Card className="p-8 mb-12 bg-red-50 border-red-200">
          <h2 className="text-2xl font-bold mb-6 text-red-900">⚠️ Automatic Penalties</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4">
              <div className="font-bold text-red-900 mb-2">-5 points</div>
              <p className="text-sm">Generic sequence labels ("Sequence 1/2/3", "Product showcase")</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="font-bold text-red-900 mb-2">-3 points</div>
              <p className="text-sm">Narrative incoherence between sequences</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="font-bold text-red-900 mb-2">-3 points</div>
              <p className="text-sm">Vague technical terms ("good", "nice", "professional")</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="font-bold text-red-900 mb-2">-3 points</div>
              <p className="text-sm">Incomplete technical specifications</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="font-bold text-red-900 mb-2">-2 points</div>
              <p className="text-sm">Missing emotional progression</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="font-bold text-red-900 mb-2">-2 points</div>
              <p className="text-sm">Imprecise timing (no seconds specified)</p>
            </div>
          </div>
        </Card>

        {/* Example Transformation */}
        <Card className="p-8 bg-gradient-to-br from-amber-50 to-orange-50">
          <h2 className="text-2xl font-bold mb-6">🎬 Real Transformation Example</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Badge className="bg-red-600 mb-3">BEFORE: 1/10</Badge>
              <div className="bg-white rounded-lg p-4 text-sm">
                <p className="font-semibold mb-2">Sequence 1:</p>
                <p className="text-muted-foreground">Product showcase with nice camera movement</p>
                <p className="font-semibold mt-3 mb-2">Sequence 2:</p>
                <p className="text-muted-foreground">Display features with good lighting</p>
                <p className="font-semibold mt-3 mb-2">Sequence 3:</p>
                <p className="text-muted-foreground">Final reveal</p>
              </div>
              <div className="mt-3 text-sm text-red-900">
                <p><strong>Issues:</strong> Generic labels, vague terms, no timing, no emotional arc</p>
              </div>
            </div>
            <div>
              <Badge className="bg-amber-500 mb-3">AFTER: 9.8/10</Badge>
              <div className="bg-white rounded-lg p-4 text-sm">
                <p className="font-semibold mb-2">0-3s: Kinetic Energy</p>
                <p className="text-muted-foreground">ARRI Alexa + 50mm T1.5, explosive slow-mo stride, particles suspended mid-air</p>
                <p className="font-semibold mt-3 mb-2">3-8s: Precision Engineering</p>
                <p className="text-muted-foreground">Macro 100mm, focus pull sole→mesh, carbon fiber detail, tension builds</p>
                <p className="font-semibold mt-3 mb-2">8-14s: Victory</p>
                <p className="text-muted-foreground">Athlete's triumphant expression, music crescendo syncs at 12s</p>
              </div>
              <div className="mt-3 text-sm text-green-900">
                <p><strong>Excellence:</strong> Precise timing, specific equipment, emotional arc, cinematic language</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
